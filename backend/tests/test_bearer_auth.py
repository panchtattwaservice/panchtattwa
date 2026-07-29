"""
Backend tests for Bearer-token auth flow added in iteration 3.

Specifically verifies that:
- get_current_user reads Authorization: Bearer header (in addition to cookie)
- /api/auth/me works with Bearer token
- /api/bookings (GET/PATCH) honors Bearer token + role
- /api/consultants honors Bearer token for admin
- /api/auth/logout invalidates a session given via Bearer token

The POST /api/auth/session endpoint cannot be invoked end-to-end without a real
Emergent OAuth session_id (third-party). We do verify that without a valid
session_id it returns 400 (not 5xx), proving the schema/handler is intact.
"""
import os
import uuid
import asyncio
from datetime import datetime, timezone, timedelta

import pytest
import requests
from sqlalchemy.ext.asyncio import create_async_engine, async_sessionmaker
from sqlalchemy import text

BASE_URL = os.environ['REACT_APP_BACKEND_URL'].rstrip('/')
DATABASE_URL = 'postgresql+asyncpg://panchtattwa_user:panchtattwa_pass@localhost/panchtattwa_db'

ADMIN_EMAIL = 'rahulsingh2k10@gmail.com'
CONSULTANT_EMAIL = 'agrawal.bindiya03@gmail.com'


@pytest.fixture(scope='module')
def api():
    return requests.Session()


# ── helpers ──────────────────────────────────────────────────────────────────
async def _seed(email: str, role: str) -> tuple[str, str]:
    engine = create_async_engine(DATABASE_URL, echo=False)
    maker = async_sessionmaker(engine, expire_on_commit=False)
    token = f"TEST_bear_{uuid.uuid4().hex}"
    uid = f"TEST_user_{uuid.uuid4().hex[:12]}"
    async with maker() as s:
        # remove prior fixture rows for this email
        await s.execute(text("DELETE FROM user_sessions WHERE user_id IN (SELECT user_id FROM users WHERE email=:e AND user_id LIKE 'TEST_user_%')"), {'e': email})
        await s.execute(text("DELETE FROM users WHERE email=:e AND user_id LIKE 'TEST_user_%'"), {'e': email})
        # Upsert: if a real (non-TEST_) user already owns this email, reuse their user_id and update role
        existing = await s.execute(text("SELECT user_id FROM users WHERE email=:e"), {'e': email})
        row = existing.first()
        if row:
            uid = row[0]
            await s.execute(text("UPDATE users SET role=:r WHERE user_id=:uid"), {'r': role, 'uid': uid})
        else:
            await s.execute(text(
                "INSERT INTO users (user_id, email, name, picture, role, created_at) "
                "VALUES (:uid,:e,'Bear Test','',:r,:c)"
            ), {'uid': uid, 'e': email, 'r': role, 'c': datetime.now(timezone.utc)})
        await s.execute(text(
            "INSERT INTO user_sessions (id, user_id, session_token, expires_at, created_at) "
            "VALUES (:id,:uid,:t,:ex,:c)"
        ), {'id': str(uuid.uuid4()), 'uid': uid, 't': token,
            'ex': datetime.now(timezone.utc) + timedelta(hours=1),
            'c': datetime.now(timezone.utc)})
        await s.commit()
    await engine.dispose()
    return token, uid


async def _cleanup():
    engine = create_async_engine(DATABASE_URL, echo=False)
    maker = async_sessionmaker(engine, expire_on_commit=False)
    async with maker() as s:
        await s.execute(text("DELETE FROM bookings WHERE id LIKE 'TEST-BK-%'"))
        await s.execute(text("DELETE FROM user_sessions WHERE session_token LIKE 'TEST_bear_%'"))
        await s.execute(text("DELETE FROM users WHERE user_id LIKE 'TEST_user_%'"))
        await s.commit()
    await engine.dispose()


async def _insert_booking(user_id: str | None = None) -> str:
    engine = create_async_engine(DATABASE_URL, echo=False)
    maker = async_sessionmaker(engine, expire_on_commit=False)
    bid = f"TEST-BK-{uuid.uuid4().hex[:8].upper()}"
    async with maker() as s:
        await s.execute(text(
            "INSERT INTO bookings (id,user_id,name,phone,email,service,message,status,booked_at) "
            "VALUES (:id,:uid,'Test User','9999999999','t@e.com','Vastu','msg','Pending Confirmation',:c)"
        ), {'id': bid, 'uid': user_id, 'c': datetime.now(timezone.utc)})
        await s.commit()
    await engine.dispose()
    return bid


# ── 1. Schema / response shape ────────────────────────────────────────────────
def test_session_exchange_rejects_invalid_session_id(api):
    """POST /api/auth/session with garbage session_id must return 4xx, not 5xx."""
    r = api.post(f"{BASE_URL}/api/auth/session",
                 json={'session_id': f'invalid_{uuid.uuid4().hex}'})
    assert r.status_code == 400, r.text
    assert 'Failed to exchange session' in r.text or 'Invalid session' in r.text


def test_session_exchange_missing_body_returns_422(api):
    r = api.post(f"{BASE_URL}/api/auth/session", json={})
    assert r.status_code == 422


# ── 2. Bearer token end-to-end ────────────────────────────────────────────────
def test_auth_me_with_bearer_returns_user_and_role(api):
    token, _ = asyncio.run(_seed(CONSULTANT_EMAIL, 'consultant'))
    try:
        r = api.get(f"{BASE_URL}/api/auth/me",
                    headers={'Authorization': f'Bearer {token}'})
        assert r.status_code == 200, r.text
        d = r.json()
        assert d['email'] == CONSULTANT_EMAIL
        assert d['role'] == 'consultant'
        assert 'user_id' in d and d['user_id']
    finally:
        asyncio.run(_cleanup())


def test_auth_me_with_invalid_bearer_returns_401(api):
    r = api.get(f"{BASE_URL}/api/auth/me",
                headers={'Authorization': 'Bearer not_a_real_token_xyz'})
    assert r.status_code == 401


def test_consultants_endpoint_with_admin_bearer(api):
    token, _ = asyncio.run(_seed(ADMIN_EMAIL, 'admin'))
    try:
        r = api.get(f"{BASE_URL}/api/consultants",
                    headers={'Authorization': f'Bearer {token}'})
        assert r.status_code == 200, r.text
        data = r.json()
        assert isinstance(data, list) and len(data) >= 2
        assert all('_id' not in c for c in data)  # MongoDB _id leakage check (n/a but good practice)
    finally:
        asyncio.run(_cleanup())


def test_bookings_get_with_consultant_bearer(api):
    token, _ = asyncio.run(_seed(CONSULTANT_EMAIL, 'consultant'))
    try:
        r = api.get(f"{BASE_URL}/api/bookings",
                    headers={'Authorization': f'Bearer {token}'})
        assert r.status_code == 200
        assert isinstance(r.json(), list)
    finally:
        asyncio.run(_cleanup())


def test_bookings_patch_with_consultant_bearer(api):
    token, _ = asyncio.run(_seed(CONSULTANT_EMAIL, 'consultant'))
    bid = asyncio.run(_insert_booking())
    try:
        r = api.patch(f"{BASE_URL}/api/bookings/{bid}",
                      json={'status': 'Confirmed'},
                      headers={'Authorization': f'Bearer {token}'})
        assert r.status_code == 200, r.text
        d = r.json()
        assert d['id'] == bid
        assert d['status'] == 'Confirmed'

        # Verify persisted via second GET
        r2 = api.get(f"{BASE_URL}/api/bookings",
                     headers={'Authorization': f'Bearer {token}'})
        match = [b for b in r2.json() if b['id'] == bid]
        assert match and match[0]['status'] == 'Confirmed'
    finally:
        asyncio.run(_cleanup())


def test_bookings_patch_forbidden_for_client(api):
    token, _ = asyncio.run(_seed('TEST_client@example.com', 'client'))
    bid = asyncio.run(_insert_booking())
    try:
        r = api.patch(f"{BASE_URL}/api/bookings/{bid}",
                      json={'status': 'Confirmed'},
                      headers={'Authorization': f'Bearer {token}'})
        assert r.status_code == 403
    finally:
        asyncio.run(_cleanup())


# ── 3. Logout via Bearer ──────────────────────────────────────────────────────
def test_logout_with_bearer_invalidates_session(api):
    token, _ = asyncio.run(_seed(CONSULTANT_EMAIL, 'consultant'))
    try:
        # Token works before logout
        r1 = api.get(f"{BASE_URL}/api/auth/me",
                     headers={'Authorization': f'Bearer {token}'})
        assert r1.status_code == 200

        # Logout using Bearer
        r2 = api.post(f"{BASE_URL}/api/auth/logout",
                      headers={'Authorization': f'Bearer {token}'})
        assert r2.status_code == 200
        assert r2.json().get('message') == 'Logged out'

        # Same token must now be rejected (expires_at moved to now)
        r3 = api.get(f"{BASE_URL}/api/auth/me",
                     headers={'Authorization': f'Bearer {token}'})
        assert r3.status_code == 401
    finally:
        asyncio.run(_cleanup())


def test_logout_without_token_still_ok(api):
    r = api.post(f"{BASE_URL}/api/auth/logout")
    assert r.status_code == 200


# ── 4. AuthResponse shape (verified indirectly via DB-seeded session) ────────
def test_authresponse_model_has_session_token_field():
    """Static schema check on the imported FastAPI app."""
    import sys
    sys.path.insert(0, '/app/backend')
    import server  # noqa: WPS433
    fields = server.AuthResponse.model_fields
    assert 'session_token' in fields
    assert 'role' in fields
    assert 'email' in fields

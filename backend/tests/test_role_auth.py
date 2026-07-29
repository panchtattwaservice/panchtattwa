"""
Backend tests for PanchTattwa consultant role-based auth.
Verifies: health, /api/auth/me (401), /api/consultants (admin required),
consultant seeding, and role assignment by directly seeding sessions in DB.
"""
import os
import uuid
import asyncio
from datetime import datetime, timezone, timedelta

import pytest
import requests
from sqlalchemy.ext.asyncio import create_async_engine, async_sessionmaker
from sqlalchemy import text

BASE_URL = os.environ.get('REACT_APP_BACKEND_URL', 'https://vastu-consult-dev.preview.emergentagent.com').rstrip('/')
DATABASE_URL = 'postgresql+asyncpg://panchtattwa_user:panchtattwa_pass@localhost/panchtattwa_db'

ADMIN_EMAIL = 'rahulsingh2k10@gmail.com'
CONSULTANT_EMAIL = 'agrawal.bindiya03@gmail.com'
CLIENT_EMAIL = 'TEST_random_client@example.com'


@pytest.fixture(scope='module')
def api():
    s = requests.Session()
    return s


# ── helpers ───────────────────────────────────────────────────────────────────
async def _seed_user_and_session(email: str, role: str) -> str:
    """Directly insert a User + UserSession row, returns session_token."""
    engine = create_async_engine(DATABASE_URL, echo=False)
    maker = async_sessionmaker(engine, expire_on_commit=False)
    token = f"TEST_tok_{uuid.uuid4().hex}"
    user_id = f"TEST_user_{uuid.uuid4().hex[:12]}"
    async with maker() as s:
        # Clean any prior test data
        await s.execute(text("DELETE FROM user_sessions WHERE session_token LIKE 'TEST_tok_%' AND user_id IN (SELECT user_id FROM users WHERE email=:e)"), {'e': email})
        await s.execute(text("DELETE FROM users WHERE email=:e AND user_id LIKE 'TEST_user_%'"), {'e': email})
        existing = await s.execute(text("SELECT user_id FROM users WHERE email=:e"), {'e': email})
        row = existing.first()
        if row:
            user_id = row[0]
            await s.execute(text("UPDATE users SET role=:r WHERE user_id=:uid"), {'r': role, 'uid': user_id})
        else:
            await s.execute(text("""
                INSERT INTO users (user_id, email, name, picture, role, created_at)
                VALUES (:uid, :e, :n, '', :r, :c)
            """), {'uid': user_id, 'e': email, 'n': 'Test', 'r': role, 'c': datetime.now(timezone.utc)})
        await s.execute(text("""
            INSERT INTO user_sessions (id, user_id, session_token, expires_at, created_at)
            VALUES (:id, :uid, :t, :ex, :c)
        """), {'id': str(uuid.uuid4()), 'uid': user_id, 't': token,
               'ex': datetime.now(timezone.utc) + timedelta(hours=1),
               'c': datetime.now(timezone.utc)})
        await s.commit()
    await engine.dispose()
    return token


async def _cleanup():
    engine = create_async_engine(DATABASE_URL, echo=False)
    maker = async_sessionmaker(engine, expire_on_commit=False)
    async with maker() as s:
        await s.execute(text("DELETE FROM user_sessions WHERE session_token LIKE 'TEST_tok_%'"))
        await s.execute(text("DELETE FROM users WHERE user_id LIKE 'TEST_user_%'"))
        await s.commit()
    await engine.dispose()


# ── 1. Health & auth surface ──────────────────────────────────────────────────
def test_api_health(api):
    r = api.get(f"{BASE_URL}/api/")
    assert r.status_code == 200
    assert 'PanchTattwa' in r.json().get('message', '')


def test_auth_me_unauthenticated_returns_401(api):
    r = api.get(f"{BASE_URL}/api/auth/me")
    assert r.status_code == 401


def test_consultants_endpoint_requires_auth(api):
    r = api.get(f"{BASE_URL}/api/consultants")
    assert r.status_code == 401


def test_bookings_requires_auth(api):
    r = api.get(f"{BASE_URL}/api/bookings")
    assert r.status_code == 401


# ── 2. DB schema / seed verification ──────────────────────────────────────────
def test_consultants_table_seeded():
    async def run():
        engine = create_async_engine(DATABASE_URL, echo=False)
        maker = async_sessionmaker(engine, expire_on_commit=False)
        async with maker() as s:
            res = await s.execute(text("SELECT email FROM consultants WHERE is_active=true ORDER BY email"))
            emails = [r[0] for r in res.fetchall()]
        await engine.dispose()
        return emails
    emails = asyncio.run(run())
    assert ADMIN_EMAIL in emails
    assert CONSULTANT_EMAIL in emails
    assert len(emails) >= 2


def test_users_table_schema():
    async def run():
        engine = create_async_engine(DATABASE_URL, echo=False)
        maker = async_sessionmaker(engine, expire_on_commit=False)
        async with maker() as s:
            res = await s.execute(text("""
                SELECT column_name FROM information_schema.columns
                WHERE table_name='users' ORDER BY ordinal_position
            """))
            cols = [r[0] for r in res.fetchall()]
        await engine.dispose()
        return cols
    cols = asyncio.run(run())
    for required in ('user_id', 'email', 'name', 'picture', 'role', 'created_at'):
        assert required in cols, f"Missing column: {required}"


# ── 3. Role-based access: simulate sessions for admin/consultant/client ──────
def test_admin_session_can_access_consultants_endpoint(api):
    token = asyncio.run(_seed_user_and_session(ADMIN_EMAIL, 'admin'))
    try:
        r = api.get(f"{BASE_URL}/api/consultants",
                    headers={'Authorization': f'Bearer {token}'})
        assert r.status_code == 200, r.text
        data = r.json()
        assert isinstance(data, list)
        emails = [c['email'] for c in data]
        assert ADMIN_EMAIL in emails
        assert CONSULTANT_EMAIL in emails
    finally:
        asyncio.run(_cleanup())


def test_consultant_session_cannot_list_consultants(api):
    token = asyncio.run(_seed_user_and_session(CONSULTANT_EMAIL, 'consultant'))
    try:
        r = api.get(f"{BASE_URL}/api/consultants",
                    headers={'Authorization': f'Bearer {token}'})
        assert r.status_code == 403
    finally:
        asyncio.run(_cleanup())


def test_client_session_cannot_list_consultants(api):
    token = asyncio.run(_seed_user_and_session(CLIENT_EMAIL, 'client'))
    try:
        r = api.get(f"{BASE_URL}/api/consultants",
                    headers={'Authorization': f'Bearer {token}'})
        assert r.status_code == 403
    finally:
        asyncio.run(_cleanup())


def test_auth_me_with_valid_token_returns_user_with_role(api):
    token = asyncio.run(_seed_user_and_session(CONSULTANT_EMAIL, 'consultant'))
    try:
        r = api.get(f"{BASE_URL}/api/auth/me",
                    headers={'Authorization': f'Bearer {token}'})
        assert r.status_code == 200, r.text
        data = r.json()
        assert data['email'] == CONSULTANT_EMAIL
        assert data['role'] == 'consultant'
        assert 'user_id' in data
    finally:
        asyncio.run(_cleanup())


def test_consultant_can_list_bookings(api):
    token = asyncio.run(_seed_user_and_session(CONSULTANT_EMAIL, 'consultant'))
    try:
        r = api.get(f"{BASE_URL}/api/bookings",
                    headers={'Authorization': f'Bearer {token}'})
        assert r.status_code == 200
        assert isinstance(r.json(), list)
    finally:
        asyncio.run(_cleanup())


def test_expired_session_returns_401(api):
    """Insert an already-expired session and verify 401."""
    async def setup():
        engine = create_async_engine(DATABASE_URL, echo=False)
        maker = async_sessionmaker(engine, expire_on_commit=False)
        token = f"TEST_tok_exp_{uuid.uuid4().hex}"
        uid = f"TEST_user_exp_{uuid.uuid4().hex[:8]}"
        async with maker() as s:
            await s.execute(text("""
                INSERT INTO users (user_id, email, name, picture, role, created_at)
                VALUES (:uid, :e, '', '', 'client', :c)
            """), {'uid': uid, 'e': f'TEST_exp_{uuid.uuid4().hex[:6]}@x.com', 'c': datetime.now(timezone.utc)})
            await s.execute(text("""
                INSERT INTO user_sessions (id, user_id, session_token, expires_at, created_at)
                VALUES (:id, :uid, :t, :ex, :c)
            """), {'id': str(uuid.uuid4()), 'uid': uid, 't': token,
                   'ex': datetime.now(timezone.utc) - timedelta(hours=1),
                   'c': datetime.now(timezone.utc)})
            await s.commit()
        await engine.dispose()
        return token
    token = asyncio.run(setup())
    try:
        r = api.get(f"{BASE_URL}/api/auth/me",
                    headers={'Authorization': f'Bearer {token}'})
        assert r.status_code == 401
    finally:
        asyncio.run(_cleanup())

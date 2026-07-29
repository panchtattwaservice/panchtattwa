from fastapi import FastAPI, APIRouter, HTTPException, Response, Request, Depends
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.ext.asyncio import create_async_engine, AsyncSession, async_sessionmaker
from sqlalchemy.orm import DeclarativeBase, Mapped, mapped_column
from sqlalchemy import String, DateTime, Text, Boolean, select, update as sa_update
from pydantic import BaseModel
import os, uuid, httpx, subprocess
from datetime import datetime, timezone, timedelta
from contextlib import asynccontextmanager
from pathlib import Path
from dotenv import load_dotenv
import logging

ROOT_DIR = Path(__file__).parent
load_dotenv(ROOT_DIR / '.env')

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# Config
DATABASE_URL = os.environ['DATABASE_URL']
# Auto-convert postgresql:// to postgresql+asyncpg:// (Railway provides sync URL)
if DATABASE_URL.startswith('postgresql://'):
    DATABASE_URL = DATABASE_URL.replace('postgresql://', 'postgresql+asyncpg://', 1)
elif DATABASE_URL.startswith('postgres://'):
    DATABASE_URL = DATABASE_URL.replace('postgres://', 'postgresql+asyncpg://', 1)
ADMIN_EMAIL = os.environ.get('ADMIN_EMAIL', 'rahulsingh2k10@gmail.com')

SEED_CONSULTANTS = [
    {'email': 'rahulsingh2k10@gmail.com', 'name': 'Rahul Singh'},
    {'email': 'agrawal.bindiya03@gmail.com', 'name': 'Bindiya Agrawal'},
]

SEED_BOOKINGS = [
    # Completed consultations (past)
    {'id': 'BK-DEMO-001', 'name': 'Priya Sharma', 'phone': '+91 9876543210', 'email': 'priya.sharma@gmail.com',
     'service': 'Home Vastu', 'message': 'New flat in Andheri West, need complete Vastu analysis before moving in.',
     'status': 'Completed', 'days_ago': 45},
    {'id': 'BK-DEMO-002', 'name': 'Rajesh Mehta', 'phone': '+91 9823456789', 'email': 'rajesh.mehta@outlook.com',
     'service': 'Office Vastu', 'message': 'Our startup office has been underperforming. Want to check Vastu alignment.',
     'status': 'Completed', 'days_ago': 38},
    {'id': 'BK-DEMO-003', 'name': 'Sunita Desai', 'phone': '+91 9812345678', 'email': 'sunita.desai@yahoo.com',
     'service': 'Astrology Reading', 'message': 'Looking for career guidance based on my kundali.',
     'status': 'Completed', 'days_ago': 30},

    # Report Sent
    {'id': 'BK-DEMO-004', 'name': 'Amit Patel', 'phone': '+91 9845678901', 'email': 'amit.patel@gmail.com',
     'service': 'Plot & Site Vastu', 'message': 'Purchased a new plot in Ahmedabad for building our home. Need direction analysis.',
     'status': 'Report Sent', 'days_ago': 12},
    {'id': 'BK-DEMO-005', 'name': 'Kavita Joshi', 'phone': '+91 9867890123', 'email': 'kavita.joshi@gmail.com',
     'service': 'Home Vastu', 'message': 'Want to improve positive energy in our existing home without major renovations.',
     'status': 'Report Sent', 'days_ago': 10},

    # In Progress
    {'id': 'BK-DEMO-006', 'name': 'Deepak Verma', 'phone': '+91 9834567890', 'email': 'deepak.verma@hotmail.com',
     'service': 'Factory / Industrial', 'message': 'Manufacturing unit in Surat. Production has been inconsistent. Need Vastu audit.',
     'status': 'In Progress', 'days_ago': 7},
    {'id': 'BK-DEMO-007', 'name': 'Neha Gupta', 'phone': '+91 9856789012', 'email': 'neha.gupta@gmail.com',
     'service': 'Online Consultation', 'message': 'Living abroad, need online Vastu guidance for our apartment in London.',
     'status': 'In Progress', 'days_ago': 5},

    # Confirmed (upcoming)
    {'id': 'BK-DEMO-008', 'name': 'Vikram Singh', 'phone': '+91 9878901234', 'email': 'vikram.singh@gmail.com',
     'service': 'Home Vastu', 'message': 'Recently renovated home. Want to ensure renovations are Vastu-compliant.',
     'status': 'Confirmed', 'days_ago': 3},
    {'id': 'BK-DEMO-009', 'name': 'Anita Reddy', 'phone': '+91 9890123456', 'email': 'anita.reddy@outlook.com',
     'service': 'Astrology Reading', 'message': 'Want marriage compatibility analysis and muhurat suggestions.',
     'status': 'Confirmed', 'days_ago': 1},

    # Pending Confirmation (newest)
    {'id': 'BK-DEMO-010', 'name': 'Rohit Agarwal', 'phone': '+91 9801234567', 'email': 'rohit.agarwal@gmail.com',
     'service': 'Office Vastu', 'message': 'New co-working space in Bangalore. Need Vastu consultation before setup.',
     'status': 'Pending Confirmation', 'days_ago': 0},
    {'id': 'BK-DEMO-011', 'name': 'Meera Iyer', 'phone': '+91 9812345670', 'email': 'meera.iyer@gmail.com',
     'service': 'Plot & Site Vastu', 'message': 'Buying farmland near Pune. Need Vastu analysis for the plot orientation.',
     'status': 'Pending Confirmation', 'days_ago': 0},
    {'id': 'BK-DEMO-012', 'name': 'Sanjay Kapoor', 'phone': '+91 9823456780', 'email': 'sanjay.kapoor@yahoo.com',
     'service': 'Home Vastu', 'message': 'Facing health issues in family. Someone suggested Vastu correction might help.',
     'status': 'Pending Confirmation', 'days_ago': 1},
]


# ── SQLAlchemy async setup ────────────────────────────────────────────────────
engine = create_async_engine(DATABASE_URL, echo=False)
async_session_maker = async_sessionmaker(engine, expire_on_commit=False)

class Base(DeclarativeBase):
    pass


# ── ORM Models ────────────────────────────────────────────────────────────────
class User(Base):
    __tablename__ = "users"
    user_id: Mapped[str] = mapped_column(String(100), primary_key=True)
    email: Mapped[str] = mapped_column(String(255), unique=True, nullable=False)
    name: Mapped[str] = mapped_column(String(255), nullable=True)
    picture: Mapped[str] = mapped_column(String(500), nullable=True)
    role: Mapped[str] = mapped_column(String(20), default='client')
    created_at: Mapped[datetime] = mapped_column(DateTime(timezone=True))


class UserSession(Base):
    __tablename__ = "user_sessions"
    id: Mapped[str] = mapped_column(String(100), primary_key=True)
    user_id: Mapped[str] = mapped_column(String(100), nullable=False)
    session_token: Mapped[str] = mapped_column(String(500), unique=True, nullable=False)
    expires_at: Mapped[datetime] = mapped_column(DateTime(timezone=True))
    created_at: Mapped[datetime] = mapped_column(DateTime(timezone=True))


class Consultant(Base):
    __tablename__ = "consultants"
    id: Mapped[str] = mapped_column(String(50), primary_key=True)
    email: Mapped[str] = mapped_column(String(255), unique=True, nullable=False)
    name: Mapped[str] = mapped_column(String(255), nullable=True)
    is_active: Mapped[bool] = mapped_column(Boolean, default=True)
    added_at: Mapped[datetime] = mapped_column(DateTime(timezone=True))


class Booking(Base):
    __tablename__ = "bookings"
    id: Mapped[str] = mapped_column(String(50), primary_key=True)
    user_id: Mapped[str] = mapped_column(String(100), nullable=True)
    name: Mapped[str] = mapped_column(String(255))
    phone: Mapped[str] = mapped_column(String(50))
    email: Mapped[str] = mapped_column(String(255))
    service: Mapped[str] = mapped_column(String(100))
    message: Mapped[str] = mapped_column(Text, nullable=True)
    status: Mapped[str] = mapped_column(String(50), default='Pending Confirmation')
    booked_at: Mapped[datetime] = mapped_column(DateTime(timezone=True))


# ── Pydantic Schemas ──────────────────────────────────────────────────────────
class UserOut(BaseModel):
    user_id: str
    email: str
    name: str | None = None
    picture: str | None = None
    role: str
    model_config = {"from_attributes": True}


class AuthResponse(BaseModel):
    user_id: str
    email: str
    name: str | None = None
    picture: str | None = None
    role: str
    session_token: str
    model_config = {"from_attributes": True}


class SessionRequest(BaseModel):
    session_id: str


class BookingCreate(BaseModel):
    name: str
    phone: str
    email: str
    service: str
    message: str | None = None


class BookingOut(BaseModel):
    id: str
    user_id: str | None = None
    name: str
    phone: str
    email: str
    service: str
    message: str | None = None
    status: str
    booked_at: datetime
    model_config = {"from_attributes": True}


class BookingStatusUpdate(BaseModel):
    status: str


# ── Lifespan ──────────────────────────────────────────────────────────────────
@asynccontextmanager
async def lifespan(app: FastAPI):
    # Start local PostgreSQL if available (dev/preview only, skipped on Railway)
    try:
        subprocess.run(['pg_ctlcluster', '15', 'main', 'start'], capture_output=True)
    except FileNotFoundError:
        pass
    # Auto-create tables
    async with engine.begin() as conn:
        await conn.run_sync(Base.metadata.create_all)
    logger.info("Database tables created/verified")

    # Seed consultants table
    async with async_session_maker() as session:
        for c in SEED_CONSULTANTS:
            result = await session.execute(select(Consultant).where(Consultant.email == c['email']))
            if not result.scalar_one_or_none():
                session.add(Consultant(
                    id=f"cons_{uuid.uuid4().hex[:8]}",
                    email=c['email'],
                    name=c['name'],
                    is_active=True,
                    added_at=datetime.now(timezone.utc),
                ))
        await session.commit()
    logger.info("Consultants seeded")

    # Seed sample bookings
    async with async_session_maker() as session:
        for b in SEED_BOOKINGS:
            result = await session.execute(select(Booking).where(Booking.id == b['id']))
            if not result.scalar_one_or_none():
                session.add(Booking(
                    id=b['id'],
                    user_id=None,
                    name=b['name'],
                    phone=b['phone'],
                    email=b['email'],
                    service=b['service'],
                    message=b['message'],
                    status=b['status'],
                    booked_at=datetime.now(timezone.utc) - timedelta(days=b['days_ago']),
                ))
        await session.commit()
    logger.info("Sample bookings seeded")

    yield
    await engine.dispose()


app = FastAPI(lifespan=lifespan)
api_router = APIRouter(prefix="/api")


# ── CORS ──────────────────────────────────────────────────────────────────────
_cors_str = os.environ.get('CORS_ORIGINS', '*')
_origins = [o.strip() for o in _cors_str.split(',') if o.strip()]
_use_wildcard = '*' in _origins

app.add_middleware(
    CORSMiddleware,
    allow_origins=['*'] if _use_wildcard else _origins,
    allow_credentials=not _use_wildcard,
    allow_methods=['*'],
    allow_headers=['*'],
)


# ── Dependencies ──────────────────────────────────────────────────────────────
async def get_db():
    async with async_session_maker() as session:
        yield session


async def get_current_user(request: Request, db: AsyncSession = Depends(get_db)) -> User:
    # Prefer Bearer token (used by frontend), fall back to cookie
    token = None
    auth = request.headers.get('Authorization', '')
    if auth.startswith('Bearer '):
        token = auth[7:]
    if not token:
        token = request.cookies.get('session_token')
    if not token:
        raise HTTPException(status_code=401, detail="Not authenticated")

    result = await db.execute(select(UserSession).where(UserSession.session_token == token))
    sess = result.scalar_one_or_none()
    if not sess:
        raise HTTPException(status_code=401, detail="Session not found")

    expires = sess.expires_at
    if expires.tzinfo is None:
        expires = expires.replace(tzinfo=timezone.utc)
    if expires < datetime.now(timezone.utc):
        raise HTTPException(status_code=401, detail="Session expired")

    result = await db.execute(select(User).where(User.user_id == sess.user_id))
    user = result.scalar_one_or_none()
    if not user:
        raise HTTPException(status_code=401, detail="User not found")
    return user


async def require_admin(user: User = Depends(get_current_user)) -> User:
    if user.role != 'admin':
        raise HTTPException(status_code=403, detail="Admin access required")
    return user


async def require_consultant(user: User = Depends(get_current_user)) -> User:
    if user.role not in ('admin', 'consultant'):
        raise HTTPException(status_code=403, detail="Consultant access required")
    return user


# ── Auth Routes ───────────────────────────────────────────────────────────────
@api_router.post("/auth/session")
async def exchange_session(req: SessionRequest, response: Response, db: AsyncSession = Depends(get_db)):
    """Exchange Emergent Auth session_id for our persistent session"""
    async with httpx.AsyncClient() as client:
        try:
            resp = await client.get(
                "https://demobackend.emergentagent.com/auth/v1/env/oauth/session-data",
                headers={"X-Session-ID": req.session_id},
                timeout=10.0
            )
            resp.raise_for_status()
            data = resp.json()
        except Exception as e:
            logger.error(f"Session exchange failed: {e}")
            raise HTTPException(status_code=400, detail="Failed to exchange session")

    email = data.get('email', '')
    session_token = data.get('session_token', '')
    if not email or not session_token:
        raise HTTPException(status_code=400, detail="Invalid session data")

    # Determine role: check consultants table first, then admin email
    role = 'client'
    result_cons = await db.execute(
        select(Consultant).where(Consultant.email == email, Consultant.is_active.is_(True))
    )
    is_consultant = result_cons.scalar_one_or_none() is not None

    if email == ADMIN_EMAIL:
        role = 'admin'
    elif is_consultant:
        role = 'consultant'

    # Upsert user
    result = await db.execute(select(User).where(User.email == email))
    user = result.scalar_one_or_none()

    if not user:
        user = User(
            user_id=f"user_{uuid.uuid4().hex[:12]}",
            email=email,
            name=data.get('name', ''),
            picture=data.get('picture', ''),
            role=role,
            created_at=datetime.now(timezone.utc)
        )
        db.add(user)
    else:
        user.name = data.get('name') or user.name
        user.picture = data.get('picture') or user.picture
        user.role = role

    # Store session
    db_sess = UserSession(
        id=str(uuid.uuid4()),
        user_id=user.user_id,
        session_token=session_token,
        expires_at=datetime.now(timezone.utc) + timedelta(days=7),
        created_at=datetime.now(timezone.utc)
    )
    db.add(db_sess)
    await db.commit()

    response.set_cookie(
        key="session_token",
        value=session_token,
        httponly=True,
        secure=True,
        samesite="none",
        max_age=7 * 24 * 60 * 60,
        path="/"
    )

    return AuthResponse(
        user_id=user.user_id,
        email=user.email,
        name=user.name,
        picture=user.picture,
        role=user.role,
        session_token=session_token,
    )


@api_router.get("/auth/me", response_model=UserOut)
async def get_me(user: User = Depends(get_current_user)):
    return UserOut.model_validate(user)


@api_router.post("/auth/logout")
async def logout(response: Response, request: Request, db: AsyncSession = Depends(get_db)):
    token = request.cookies.get('session_token')
    if not token:
        auth = request.headers.get('Authorization', '')
        if auth.startswith('Bearer '):
            token = auth[7:]
    if token:
        await db.execute(
            sa_update(UserSession)
            .where(UserSession.session_token == token)
            .values(expires_at=datetime.now(timezone.utc))
        )
        await db.commit()
    response.delete_cookie(key="session_token", path="/", samesite="none", secure=True)
    return {"message": "Logged out"}


# ── Booking Routes ────────────────────────────────────────────────────────────
@api_router.post("/bookings", response_model=BookingOut)
async def create_booking(
    data: BookingCreate,
    user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db)
):
    booking = Booking(
        id=f"BK-{uuid.uuid4().hex[:8].upper()}",
        user_id=user.user_id,
        name=data.name,
        phone=data.phone,
        email=data.email,
        service=data.service,
        message=data.message,
        status='Pending Confirmation',
        booked_at=datetime.now(timezone.utc)
    )
    db.add(booking)
    await db.commit()
    await db.refresh(booking)
    return BookingOut.model_validate(booking)


@api_router.get("/bookings", response_model=list[BookingOut])
async def list_bookings(user: User = Depends(get_current_user), db: AsyncSession = Depends(get_db)):
    if user.role in ('admin', 'consultant'):
        result = await db.execute(select(Booking).order_by(Booking.booked_at.desc()))
    else:
        result = await db.execute(
            select(Booking).where(Booking.user_id == user.user_id).order_by(Booking.booked_at.desc())
        )
    return [BookingOut.model_validate(b) for b in result.scalars().all()]


@api_router.patch("/bookings/{booking_id}", response_model=BookingOut)
async def update_booking_status(
    booking_id: str,
    payload: BookingStatusUpdate,
    user: User = Depends(require_consultant),
    db: AsyncSession = Depends(get_db)
):
    result = await db.execute(select(Booking).where(Booking.id == booking_id))
    booking = result.scalar_one_or_none()
    if not booking:
        raise HTTPException(status_code=404, detail="Booking not found")
    booking.status = payload.status
    await db.commit()
    await db.refresh(booking)
    return BookingOut.model_validate(booking)


# ── Health ────────────────────────────────────────────────────────────────────
@api_router.get("/")
async def root():
    return {"message": "PanchTattwa API — Vastu Astro Consultation"}


# ── Consultant Management (admin only) ───────────────────────────────────────
class ConsultantOut(BaseModel):
    id: str
    email: str
    name: str | None = None
    is_active: bool
    added_at: datetime
    model_config = {"from_attributes": True}


@api_router.get("/consultants", response_model=list[ConsultantOut])
async def list_consultants(user: User = Depends(require_admin), db: AsyncSession = Depends(get_db)):
    result = await db.execute(select(Consultant).order_by(Consultant.added_at.desc()))
    return [ConsultantOut.model_validate(c) for c in result.scalars().all()]


app.include_router(api_router)

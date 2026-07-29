# PanchTattwa — Vastu Astro Consultation Website

## Problem Statement
Build a premium Vastu consultancy website for consultant Bindiya Agrawal (PanchTattwa brand). Three-state single-page app: public visitor, logged-in client, consultant/admin. Real Google OAuth authentication, PostgreSQL backend, full booking/consultation management.

## Architecture

### Backend
- **Framework**: FastAPI (Python)
- **Database**: PostgreSQL 15 (asyncpg + SQLAlchemy 2.0 async)
- **Auth**: Emergent Google OAuth (session exchange via demobackend.emergentagent.com)
- **Port**: 8001 (internal), /api prefix externally

### Frontend
- **Framework**: React 18
- **Styling**: Tailwind CSS + custom CSS variables (dark Vastu theme)
- **Fonts**: Cormorant Garamond (serif headings) + DM Sans (body)
- **Port**: 3000

### Database Tables
- `users` - Google OAuth user profiles (user_id, email, name, picture, role)
- `user_sessions` - Auth sessions (session_token, expires_at)
- `bookings` - Consultation enquiries (service, status, contact info)
- `consultants` - Registered consultant emails (id, email, name, is_active, added_at)

## Role Hierarchy
- **Admin**: `rahulsingh2k10@gmail.com` — full admin access + consultant console
- **Consultant**: emails in `consultants` table (e.g., `agrawal.bindiya03@gmail.com`) — consultant console access
- **Client**: everyone else — public site + booking form + My Journey tracker

## Implemented Features (as of 2026-05-31)

### Phase 1 MVP
- [x] Full premium dark theme (deep black #111009, gold #c8883a, terra #b85c32)
- [x] Animated star field background (SVG circles with twinkle keyframe)
- [x] Hero section with spinning mandala rings, floating Panch Tattwa elements
- [x] Nav with scroll-aware backdrop blur, mobile hamburger menu (1080px breakpoint)
- [x] About section with consultant portrait, bio, stats
- [x] Services section — 6 service cards (bento grid)
- [x] Why Us — 6 feature points with rotating icon hover
- [x] Process — 6-step consultation flow
- [x] Testimonials — 4 quotes with carousel navigation
- [x] Contact section — Sign-in prompt (public) / Booking form (logged in)
- [x] Footer with brand, navigation, services, contact links
- [x] Scroll-reveal animations (IntersectionObserver)
- [x] Google OAuth via Emergent Auth
- [x] Cookie-based sessions (httpOnly, secure, samesite=none)
- [x] Client portal: My Journey tracker
- [x] Admin portal: AdminDashboard with stats, calendar, bookings table
- [x] Responsive design (mobile, tablet, desktop)

### Phase 2 — Consultant Auth (2026-05-31)
- [x] Created `consultants` table in PostgreSQL
- [x] Seeded consultant emails (rahulsingh2k10@gmail.com, agrawal.bindiya03@gmail.com)
- [x] Role-based auth: admin / consultant / client
- [x] Admin email configurable via ADMIN_EMAIL env var
- [x] Session exchange checks consultants table for role assignment
- [x] Both admin and consultant roles see Consultant Console/Dashboard
- [x] /api/consultants endpoint (admin-only) to list consultants
- [x] Frontend role checks updated (isConsultant includes admin + consultant)
- [x] Nav dropdown shows Admin/Consultant/Client badge per role
- [x] Booking status updates allowed for both admin and consultant roles
- [x] Fixed auth persistence: localStorage + Bearer token (cookies unreliable in K8s proxy)
- [x] Backend returns session_token in /api/auth/session response
- [x] Frontend authFetch() utility auto-injects Bearer token in all API calls
- [x] All component API calls (AdminDashboard, Contact, MyJourney) migrated to authFetch

## User Personas
1. **Public Visitor**: Browses marketing site, views services/process, prompted to sign in
2. **Client**: Google OAuth user, sees My Journey tracker + booking form + consultation history
3. **Consultant**: Registered in consultants table, sees Consultant Console + booking management
4. **Admin**: ADMIN_EMAIL holder, full access including consultant management API

## Core Config
- ADMIN_EMAIL: rahulsingh2k10@gmail.com
- DATABASE_URL: postgresql+asyncpg://panchtattwa_user:panchtattwa_pass@localhost/panchtattwa_db
- CORS_ORIGINS: https://vastu-consult-dev.preview.emergentagent.com

## Prioritized Backlog

### P0 — Critical
- [ ] Production PostgreSQL (persistent across container restarts)

### P1 — Important
- [ ] Pricing section implementation
- [ ] Blog/articles section
- [ ] Email notifications on booking submission

### P2 — Nice to Have
- [ ] WhatsApp direct integration
- [ ] Appointment scheduling calendar (actual date picking)
- [ ] Photo gallery of past consultations
- [ ] Multi-language support (Hindi)

# PanchTattwa — Vastu Astro Consultation Website

## Problem Statement
Build a premium Vastu consultancy website for consultant Bindiya Agrawal (PanchTattwa brand). Three-state single-page app: public visitor, logged-in client, admin. Real Google OAuth authentication, PostgreSQL backend, full booking/consultation management.

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

## Implemented Features (as of 2026-05-30)

### Phase 1 MVP
- [x] Full premium dark theme (deep black #111009, gold #c8883a, terra #b85c32)
- [x] Animated star field background (SVG circles with twinkle keyframe)
- [x] Hero section with spinning mandala rings, floating Panch Tattwa elements
- [x] Nav with scroll-aware backdrop blur, mobile hamburger menu
- [x] About section with consultant portrait, bio, stats (1000+ homes, 9+ years, 95% demolition-free)
- [x] Services section — 6 service cards (bento grid)
- [x] Why Us — 6 feature points with rotating icon hover
- [x] Process — 6-step consultation flow
- [x] Testimonials — 4 quotes with carousel navigation
- [x] Contact section — Sign-in prompt (public) / Booking form (logged in)
- [x] Footer with brand, navigation, services, contact links
- [x] Scroll-reveal animations (IntersectionObserver)
- [x] Shimmer text animation on headings
- [x] diya-breath pulse animation on CTAs
- [x] Google OAuth via Emergent Auth
- [x] AuthCallback — session exchange handler
- [x] Cookie-based sessions (httpOnly, secure, samesite=none)
- [x] Client portal: My Journey tracker (consultation progress)
- [x] Client portal: Consultation history in Contact section
- [x] Admin portal: AdminDashboard with stats, activity calendar, bookings table
- [x] Admin: Update booking status via dropdown
- [x] Pricing section hidden (as per user request)
- [x] SEO: semantic HTML, meta tags, OG tags, Schema.org markup
- [x] Fully responsive (mobile, tablet, desktop)

## User Personas
1. **Public Visitor**: Browses the marketing site, views services/process, prompted to sign in to book
2. **Client**: Google OAuth user, sees My Journey tracker + booking form + consultation history
3. **Admin (Consultant)**: Bindiya Agrawal's Google account (ADMIN_EMAIL env var), sees full dashboard

## Core Config
- ADMIN_EMAIL: bindiya@panchtattwa.com (update to actual Google email)
- DATABASE_URL: postgresql+asyncpg://panchtattwa_user:panchtattwa_pass@localhost/panchtattwa_db
- CORS_ORIGINS: https://start-here-48.preview.emergentagent.com

## Prioritized Backlog

### P0 — Critical
- [ ] Update ADMIN_EMAIL to actual consultant Google email
- [ ] Production PostgreSQL (persistent across container restarts)

### P1 — Important
- [ ] Pricing section implementation (user deferred)
- [ ] Blog/articles section
- [ ] Email notifications on booking submission

### P2 — Nice to Have
- [ ] WhatsApp direct integration
- [ ] Appointment scheduling calendar (actual date picking)
- [ ] Photo gallery of past consultations
- [ ] Multi-language support (Hindi)

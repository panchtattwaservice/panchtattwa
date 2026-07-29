import { useState, useEffect, useRef } from 'react';
import BrandIcon from './BrandIcon';

export default function Nav({ user, onSignIn, onSignOut, onScrollTo }) {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 60);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    const close = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) setDropdownOpen(false);
    };
    document.addEventListener('click', close);
    return () => document.removeEventListener('click', close);
  }, []);

  const links = ['About', 'Services', 'Why Us', 'Process', 'Testimonials'];
  const isAdmin = user?.role === 'admin';
  const isConsultant = user?.role === 'consultant' || isAdmin;
  const initial = user?.name ? user.name.charAt(0).toUpperCase() : '';

  return (
    <nav
      data-testid="main-nav"
      style={{
        position: 'fixed', top: 0, left: 0, right: 0, zIndex: 100,
        background: scrolled ? 'rgba(17,16,9,0.95)' : 'transparent',
        backdropFilter: scrolled ? 'blur(12px)' : 'none',
        borderBottom: scrolled ? '1px solid #2a2418' : 'none',
        transition: 'all 0.4s ease',
        padding: '0 clamp(20px,5vw,80px)',
      }}
    >
      <div style={{ maxWidth: 1200, margin: '0 auto', height: 68, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        {/* Logo */}
        <button
          data-testid="nav-logo"
          onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
          style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 0, textAlign: 'left', flexShrink: 0, display: 'flex', alignItems: 'center', gap: 12 }}
        >
          <BrandIcon size={40} />
          <div>
            <div className="brand-glaze" style={{ fontFamily: "'Cormorant Garamond',serif", fontSize: 20, fontWeight: 700, letterSpacing: '0.12em', textTransform: 'uppercase' }}>
              PanchTattwa
            </div>
            <div style={{ fontSize: 9, letterSpacing: '0.18em', color: 'var(--cream-dim)', textTransform: 'uppercase', marginTop: 1 }}>
              Balance • Harmony • Pure Living
            </div>
          </div>
        </button>

        {/* Desktop links — hidden on smaller screens via CSS */}
        <div className="nav-links" style={{ display: 'flex', gap: 32, alignItems: 'center' }}>
          {!isConsultant && links.map(l => (
            <button
              key={l}
              data-testid={`nav-${l.toLowerCase().replace(/\s/g, '-')}`}
              className="nav-link"
              onClick={() => onScrollTo(l.toLowerCase().replace(/\s+/g, '-'))}
            >
              {l}
            </button>
          ))}
        </div>

        {/* Auth + mobile toggle — always visible */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 16, flexShrink: 0 }}>
          {/* Auth section */}
          {user ? (
            <div style={{ position: 'relative' }} ref={dropdownRef}>
              <button
                data-testid="nav-user-avatar"
                className="avatar-btn"
                onClick={e => { e.stopPropagation(); setDropdownOpen(d => !d); }}
                style={{
                  display: 'flex', alignItems: 'center', gap: 10,
                  background: 'transparent', border: '1px solid var(--border)',
                  borderRadius: 30, padding: '4px 14px 4px 4px',
                  cursor: 'pointer', transition: 'all 0.25s', color: 'var(--cream)',
                }}
                onMouseEnter={e => e.currentTarget.style.borderColor = 'var(--gold)'}
                onMouseLeave={e => e.currentTarget.style.borderColor = 'var(--border)'}
              >
                <div style={{
                  width: 32, height: 32, borderRadius: '50%',
                  background: 'linear-gradient(135deg, var(--gold), var(--terra))',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontFamily: "'Cormorant Garamond',serif", fontWeight: 600, fontSize: 14, color: '#1a1510',
                }}>
                  {initial}
                </div>
                <span className="avatar-name-text" style={{ fontFamily: "'DM Sans',sans-serif", fontSize: 12, letterSpacing: '0.06em' }}>
                  {user.name?.split(' ')[0]}
                </span>
                <svg width="10" height="10" viewBox="0 0 10 6" fill="none" style={{ marginLeft: 2, opacity: 0.5, transition: 'transform 0.2s', transform: dropdownOpen ? 'rotate(180deg)' : 'none' }}>
                  <path d="M1 1l4 4 4-4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
                </svg>
              </button>
              {dropdownOpen && (
                <div data-testid="nav-user-dropdown" style={{
                  position: 'absolute', top: 'calc(100% + 8px)', right: 0, minWidth: 220,
                  background: '#14110b', border: '1px solid var(--border)', borderRadius: 3,
                  padding: 8, boxShadow: '0 18px 50px rgba(0,0,0,0.6)',
                  animation: 'modal-rise 0.18s ease-out',
                }} onClick={e => e.stopPropagation()}>
                  <div style={{ padding: '12px 12px 14px', borderBottom: '1px solid #1c1810', marginBottom: 6 }}>
                    <div style={{ fontFamily: "'Cormorant Garamond',serif", fontSize: 15, color: 'var(--cream)', fontWeight: 500 }}>{user.name}</div>
                    <div style={{ fontFamily: "'DM Sans',sans-serif", fontSize: 11, color: '#6a6055', marginTop: 2 }}>{user.email}</div>
                    <div style={{ fontFamily: "'DM Sans',sans-serif", fontSize: 9, letterSpacing: '0.18em', color: 'var(--gold)', marginTop: 8, textTransform: 'uppercase' }}>
                      {isAdmin ? 'Admin' : isConsultant ? 'Consultant' : 'Client'}
                    </div>
                  </div>
                  {isConsultant ? (
                    <>
                      <MenuBtn label="Consultant Console" testId="nav-admin" onClick={() => { onScrollTo('admin'); setDropdownOpen(false); }} />
                      <MenuBtn label="Profile" onClick={() => { onScrollTo('about'); setDropdownOpen(false); }} />
                    </>
                  ) : (
                    <>
                      <MenuBtn label="My Journey" testId="nav-my-journey" onClick={() => { onScrollTo('journey'); setDropdownOpen(false); }} />
                      <MenuBtn label="Consultation History" testId="nav-history" onClick={() => { onScrollTo('contact'); setDropdownOpen(false); }} />
                      <MenuBtn label="Book New Session" onClick={() => { onScrollTo('contact'); setDropdownOpen(false); }} />
                    </>
                  )}
                  <div style={{ height: 1, background: '#1c1810', margin: '6px 0' }} />
                  <MenuBtn label="Sign Out" testId="nav-signout" danger onClick={() => { onSignOut(); setDropdownOpen(false); }} />
                </div>
              )}
            </div>
          ) : (
            <button
              data-testid="nav-signin-btn"
              className="nav-cta"
              onClick={onSignIn}
              style={{ display: 'none' }}
            >
              Sign In
            </button>
          )}

          {/* Mobile hamburger — temporarily hidden */}
          <button
            data-testid="nav-mobile-toggle"
            className="mobile-menu-btn"
            onClick={() => setMenuOpen(m => !m)}
            style={{ display: 'none', background: 'none', border: 'none', cursor: 'pointer', color: 'var(--cream)', padding: 4, visibility: 'hidden' }}
            aria-label="Toggle menu"
          >
            {menuOpen
              ? <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M18 6L6 18M6 6l12 12" /></svg>
              : <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M3 6h18M3 12h18M3 18h18" /></svg>
            }
          </button>
        </div>
      </div>

      {/* Mobile dropdown */}
      {menuOpen && (
        <div style={{ background: '#14110b', borderTop: '1px solid var(--border)', padding: '20px clamp(20px,5vw,80px)' }}>
          {!isConsultant && links.map(l => (
            <button
              key={l}
              className="nav-link"
              onClick={() => { onScrollTo(l.toLowerCase().replace(/\s+/g, '-')); setMenuOpen(false); }}
              style={{ display: 'block', padding: '12px 0', width: '100%', textAlign: 'left', fontSize: 15 }}
            >
              {l}
            </button>
          ))}
        </div>
      )}

      <style>{`
        @media (max-width: 1080px) {
          .nav-links { display: none !important; }
        }
      `}</style>
    </nav>
  );
}

function MenuBtn({ label, onClick, danger, testId }) {
  return (
    <button
      data-testid={testId}
      onClick={onClick}
      style={{
        display: 'flex', alignItems: 'center', gap: 10, width: '100%',
        padding: '10px 12px', background: 'transparent', border: 'none',
        cursor: 'pointer', color: danger ? 'var(--terra-light)' : 'var(--cream)',
        fontFamily: "'DM Sans',sans-serif", fontSize: 12.5, letterSpacing: '0.04em',
        textAlign: 'left', borderRadius: 2, transition: 'background 0.15s',
      }}
      onMouseEnter={e => e.currentTarget.style.background = danger ? 'rgba(184,92,50,0.12)' : 'rgba(200,136,58,0.08)'}
      onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
    >
      {label}
    </button>
  );
}

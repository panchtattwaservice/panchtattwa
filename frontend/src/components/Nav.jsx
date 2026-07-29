import { useState, useEffect, useRef } from 'react';

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

  const links = ['About', 'Services', 'Why Us', 'Process', 'Testimonials', 'Contact'];
  const isAdmin = user?.role === 'admin';
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
          style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 0, textAlign: 'left' }}
        >
          <div className="brand-glaze" style={{ fontFamily: "'Cormorant Garamond',serif", fontSize: 20, fontWeight: 700, letterSpacing: '0.12em', textTransform: 'uppercase' }}>
            PanchTattwa
          </div>
          <div style={{ fontSize: 9, letterSpacing: '0.18em', color: 'var(--cream-dim)', textTransform: 'uppercase', marginTop: 1 }}>
            Harmonizing Spaces and Lives
          </div>
        </button>

        {/* Desktop links */}
        <div className="nav-links" style={{ display: 'flex', gap: 32, alignItems: 'center' }}>
          {!isAdmin && links.map(l => (
            <button
              key={l}
              data-testid={`nav-${l.toLowerCase().replace(/\s/g, '-')}`}
              className="nav-link"
              onClick={() => onScrollTo(l.toLowerCase().replace(/\s+/g, '-'))}
            >
              {l}
            </button>
          ))}

          {/* Auth section */}
          {user ? (
            <div style={{ position: 'relative' }} ref={dropdownRef}>
              <button
                data-testid="nav-user-avatar"
                className="avatar-btn"
                onClick={e => { e.stopPropagation(); setDropdownOpen(d => !d); }}
              >
                <div className="avatar-circle">{initial}</div>
                <span className="avatar-name">{user.name?.split(' ')[0]}</span>
                <svg width="10" height="10" viewBox="0 0 10 6" fill="none" style={{ marginLeft: 4, opacity: 0.5, transition: 'transform 0.2s', transform: dropdownOpen ? 'rotate(180deg)' : 'none' }}>
                  <path d="M1 1l4 4 4-4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
                </svg>
              </button>
              {dropdownOpen && (
                <div data-testid="nav-user-dropdown" className="user-menu" onClick={e => e.stopPropagation()}>
                  <div style={{ padding: '12px 12px 14px', borderBottom: '1px solid #1c1810', marginBottom: 6 }}>
                    <div style={{ fontFamily: "'Cormorant Garamond',serif", fontSize: 15, color: 'var(--cream)', fontWeight: 500 }}>{user.name}</div>
                    <div style={{ fontFamily: "'DM Sans',sans-serif", fontSize: 11, color: '#6a6055', marginTop: 2 }}>{user.email}</div>
                    <div style={{ fontFamily: "'DM Sans',sans-serif", fontSize: 9, letterSpacing: '0.18em', color: 'var(--gold)', marginTop: 8, textTransform: 'uppercase' }}>
                      {isAdmin ? 'Consultant' : 'Client'}
                    </div>
                  </div>
                  {isAdmin ? (
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
            >
              Sign In
            </button>
          )}
        </div>

        {/* Mobile hamburger */}
        <button
          data-testid="nav-mobile-toggle"
          className="mobile-menu-btn"
          onClick={() => setMenuOpen(m => !m)}
          style={{ display: 'none', background: 'none', border: 'none', cursor: 'pointer', color: 'var(--cream)', padding: 4 }}
          aria-label="Toggle menu"
        >
          {menuOpen
            ? <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M18 6L6 18M6 6l12 12" /></svg>
            : <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M3 6h18M3 12h18M3 18h18" /></svg>
          }
        </button>
      </div>

      {/* Mobile dropdown */}
      {menuOpen && (
        <div style={{ background: '#14110b', borderTop: '1px solid var(--border)', padding: '20px clamp(20px,5vw,80px)' }}>
          {!isAdmin && links.map(l => (
            <button
              key={l}
              className="nav-link"
              onClick={() => { onScrollTo(l.toLowerCase().replace(/\s+/g, '-')); setMenuOpen(false); }}
              style={{ display: 'block', padding: '12px 0', width: '100%', textAlign: 'left', fontSize: 15 }}
            >
              {l}
            </button>
          ))}
          {!user && (
            <button className="nav-cta" onClick={() => { onSignIn(); setMenuOpen(false); }} style={{ marginTop: 16 }}>
              Sign In
            </button>
          )}
        </div>
      )}

      <style>{`@media (max-width: 768px) { .mobile-menu-btn { display: block !important; } .nav-links { display: none !important; } }`}</style>
    </nav>
  );
}

function MenuBtn({ label, onClick, danger, testId }) {
  return (
    <button
      data-testid={testId}
      className={`user-menu-item${danger ? ' danger' : ''}`}
      onClick={onClick}
    >
      {label}
    </button>
  );
}

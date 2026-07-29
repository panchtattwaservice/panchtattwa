import { useState, useEffect } from 'react';
import BrandIcon from './BrandIcon';

export default function Nav({ onScrollTo }) {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 60);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const links = ['About', 'Services', 'Why Us', 'Process', 'Testimonials'];

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
          {links.map(l => (
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

        {/* Mobile toggle — always visible */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 16, flexShrink: 0 }}>
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
          {links.map(l => (
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

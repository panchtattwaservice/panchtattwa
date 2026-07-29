// Single-row footer — exact match of original design
export default function Footer({ onScrollTo }) {
  return (
    <footer
      data-testid="site-footer"
      style={{
        background: '#0d0b08',
        borderTop: '1px solid var(--border)',
        padding: '40px clamp(20px,6vw,80px)',
      }}
    >
      <div style={{
        maxWidth: 1100,
        margin: '0 auto',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        flexWrap: 'wrap',
        gap: 16,
      }}>
        {/* Brand */}
        <div>
          <div className="brand-glaze" style={{
            fontFamily: "'Cormorant Garamond',serif",
            fontSize: 18, fontWeight: 700,
            letterSpacing: '0.12em', textTransform: 'uppercase',
          }}>
            PanchTattwa
          </div>
          <div style={{
            fontFamily: "'DM Sans',sans-serif",
            fontSize: 10, color: '#4a4035',
            letterSpacing: '0.18em', textTransform: 'uppercase', marginTop: 2,
          }}>
            Harmonizing Spaces and Lives
          </div>
        </div>

        {/* Copyright */}
        <p style={{
          fontFamily: "'DM Sans',sans-serif",
          fontSize: 12, color: '#3a3428', textAlign: 'center',
        }}>
          © 2026 PanchTattwa · Bindiya Agrawal · +91 8154008970
        </p>

        {/* Links — exactly 3 as in original */}
        <div style={{ display: 'flex', gap: 20 }}>
          {['About', 'Services', 'Contact'].map(l => (
            <button
              key={l}
              data-testid={`footer-link-${l.toLowerCase()}`}
              className="footer-link"
              onClick={() => onScrollTo(l.toLowerCase())}
              style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 0 }}
            >
              {l}
            </button>
          ))}
        </div>
      </div>
    </footer>
  );
}

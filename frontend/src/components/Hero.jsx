import StarField from './StarField';

const YANTRA_ELEMENTS = [
  { key: 'akash',   label: 'Akash',   sanskrit: 'Ākāśaḥ', element: 'Space', bija: 'हं',  shape: 'circle' },
  { key: 'vayu',    label: 'Vayu',    sanskrit: 'Vāyuḥ',  element: 'Air',   bija: 'यं',  shape: 'hexagram' },
  { key: 'agni',    label: 'Agni',    sanskrit: 'Agniḥ',  element: 'Fire',  bija: 'रं',  shape: 'triangle' },
  { key: 'jal',     label: 'Jal',     sanskrit: 'Jala',   element: 'Water', bija: 'वं',  shape: 'crescent' },
  { key: 'prithvi', label: 'Prithvi', sanskrit: 'Pṛthvī', element: 'Earth', bija: 'लं',  shape: 'square' },
];

const RINGS_12 = [0,30,60,90,120,150,180,210,240,270,300,330];

const bijaStyle = {
  fontFamily: "'Cormorant Garamond','Noto Serif Devanagari',serif",
  fontSize: 16,
  fontWeight: 500,
  fill: 'var(--cream)',
  textAnchor: 'middle',
  dominantBaseline: 'central',
};

function YantraGlyph({ shape, bija }) {
  const s = 'var(--gold)';
  const Frame = ({ children }) => (
    <svg className="yantra-svg" width="64" height="64" viewBox="0 0 64 64"
      style={{ display: 'block', margin: '0 auto', overflow: 'visible', filter: 'drop-shadow(0 0 8px rgba(200,136,58,0.18))' }}>
      {children}
    </svg>
  );
  if (shape === 'square') return (
    <Frame>
      <rect className="yantra-shape" x="10" y="10" width="44" height="44" fill="none" stroke={s} strokeWidth="1.4" pathLength="240" />
      <rect x="14" y="14" width="36" height="36" fill="rgba(200,136,58,0.07)" opacity="0.6" />
      <text className="yantra-bija" x="32" y="33" style={bijaStyle}>{bija}</text>
    </Frame>
  );
  if (shape === 'crescent') return (
    <Frame>
      <path className="yantra-shape" d="M 10 22 A 22 22 0 0 0 54 22 Z" fill="rgba(200,136,58,0.07)" stroke={s} strokeWidth="1.4" strokeLinejoin="round" pathLength="240" />
      <text className="yantra-bija" x="32" y="33" style={bijaStyle}>{bija}</text>
    </Frame>
  );
  if (shape === 'triangle') return (
    <Frame>
      <polygon className="yantra-shape" points="32,8 56,54 8,54" fill="rgba(184,92,50,0.18)" stroke={s} strokeWidth="1.4" strokeLinejoin="round" pathLength="240" />
      <text className="yantra-bija" x="32" y="40" style={bijaStyle}>{bija}</text>
    </Frame>
  );
  if (shape === 'hexagram') return (
    <Frame>
      <polygon className="yantra-shape" points="32,6 56,48 8,48" fill="none" stroke={s} strokeWidth="1.3" strokeLinejoin="round" pathLength="240" />
      <polygon className="yantra-shape" points="32,58 8,16 56,16" fill="none" stroke={s} strokeWidth="1.3" strokeLinejoin="round" pathLength="240" />
      <polygon points="32,18 46,32 32,46 18,32" fill="rgba(200,136,58,0.10)" opacity="0.6" />
      <text className="yantra-bija" x="32" y="33" style={bijaStyle}>{bija}</text>
    </Frame>
  );
  if (shape === 'circle') return (
    <Frame>
      <circle className="yantra-shape" cx="32" cy="32" r="22" fill="none" stroke={s} strokeWidth="1.4" pathLength="240" />
      <circle cx="32" cy="32" r="18" fill="rgba(200,136,58,0.07)" opacity="0.6" />
      <text className="yantra-bija" x="32" y="33" style={bijaStyle}>{bija}</text>
    </Frame>
  );
  return null;
}

export default function Hero({ user, onBook }) {
  const isAdmin = user?.role === 'admin';
  const phone = '+91 775 091 3439';
  const waNumber = '917750913439';

  return (
    <section
      id="hero"
      data-testid="hero-section"
      style={{
        position: 'relative',
        minHeight: '100vh',
        background: 'radial-gradient(ellipse 80% 60% at 50% 0%, #2a2018 0%, #111009 70%)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        overflow: 'hidden',
      }}
    >
      <StarField count={160} />

      {/* Radial orb glow */}
      <div className="hero-orb" style={{
        position: 'absolute', top: '50%', left: '50%',
        width: 600, height: 600,
        background: 'radial-gradient(ellipse, rgba(184,92,50,0.08) 0%, transparent 70%)',
        borderRadius: '50%', pointerEvents: 'none',
      }} />

      {/* Mandala rings SVG — EXACT from original (opacity 0.42) */}
      <svg
        style={{
          position: 'absolute', top: '50%', left: '50%',
          transform: 'translate(-50%,-50%)',
          pointerEvents: 'none',
          opacity: 0.42,
          filter: 'drop-shadow(0 0 12px rgba(200,136,58,0.25))',
        }}
        width="700" height="700" viewBox="0 0 700 700"
        aria-hidden="true"
      >
        {/* Outer ring — r=280, lines 160→280 */}
        <g className="hero-ring-outer">
          <circle cx="350" cy="350" r="280" stroke="#c8883a" strokeWidth="0.8" fill="none" strokeDasharray="4 8" />
          {RINGS_12.map(a => {
            const rad = (Math.PI * a) / 180;
            return (
              <line key={a}
                x1={(350 + Math.cos(rad) * 160).toFixed(1)} y1={(350 + Math.sin(rad) * 160).toFixed(1)}
                x2={(350 + Math.cos(rad) * 280).toFixed(1)} y2={(350 + Math.sin(rad) * 280).toFixed(1)}
                stroke="#c8883a" strokeWidth="0.5"
              />
            );
          })}
        </g>
        {/* Mid ring — r=220, 8 dots */}
        <g className="hero-ring-mid">
          <circle cx="350" cy="350" r="220" stroke="#c8883a" strokeWidth="0.6" fill="none" strokeDasharray="2 12" />
          {[0,45,90,135,180,225,270,315].map(a => {
            const rad = (Math.PI * a) / 180;
            return <circle key={a} cx={(350 + Math.cos(rad) * 220).toFixed(1)} cy={(350 + Math.sin(rad) * 220).toFixed(1)} r="2" fill="#c8883a" opacity="0.6" />;
          })}
        </g>
        {/* Inner ring — r=160 */}
        <g className="hero-ring-inner">
          <circle cx="350" cy="350" r="160" stroke="#c8883a" strokeWidth="0.5" fill="none" strokeDasharray="2 6" />
        </g>
        {/* Orbiting dot — translateX(280px) as in original */}
        <g className="orbit-dot-hero">
          <circle cx="350" cy="350" r="5" fill="#ddb06a" opacity="0.9">
            <animate attributeName="opacity" values="0.9;0.4;0.9" dur="2s" repeatCount="indefinite" />
          </circle>
          <circle cx="350" cy="350" r="10" fill="none" stroke="#ddb06a" strokeWidth="0.5" opacity="0.4" />
        </g>
      </svg>

      {/* Main content */}
      <div style={{
        position: 'relative', zIndex: 2, textAlign: 'center',
        padding: '120px clamp(20px,6vw,80px) 80px',
        animation: 'fade-up 1.2s cubic-bezier(0.16,1,0.3,1) both',
      }}>
        {/* Eyebrow */}
        <p style={{
          fontFamily: "'DM Sans',sans-serif",
          fontSize: 11,
          letterSpacing: '0.28em',
          textTransform: 'uppercase',
          color: 'var(--terra-light)',
          marginBottom: 24,
        }}>
          ✦ Vastu · Astrology · Cosmic Harmony ✦
        </p>

        {/* Giant brand title */}
        <h1 style={{
          fontFamily: "'Cormorant Garamond',serif",
          fontWeight: 300,
          fontSize: 'clamp(52px,9vw,108px)',
          lineHeight: 1.0,
          color: 'var(--cream)',
          marginBottom: 12,
          letterSpacing: '-0.01em',
        }}>
          Panch<span style={{ color: 'var(--gold)', fontStyle: 'italic' }}>Tattwa</span>
        </h1>

        {/* Italic subtitle */}
        <p style={{
          fontFamily: "'Cormorant Garamond',serif",
          fontSize: 'clamp(18px,2.8vw,28px)',
          fontWeight: 300,
          fontStyle: 'italic',
          color: 'var(--cream-dim)',
          marginBottom: 12,
          letterSpacing: '0.04em',
        }}>
          Harmonizing Spaces and Lives
        </p>

        {/* Tagline */}
        <p style={{
          fontFamily: "'DM Sans',sans-serif",
          fontSize: 'clamp(13px,1.5vw,16px)',
          color: '#8a8070',
          marginBottom: 48,
          fontWeight: 300,
          letterSpacing: '0.02em',
        }}>
          Bring Positivity, Peace &amp; Prosperity to Your Life
        </p>

        {/* CTAs — temporarily hidden */}
        {false && !isAdmin && (
          <div style={{ display: 'flex', gap: 16, justifyContent: 'center', flexWrap: 'wrap' }}>
            <button
              data-testid="hero-cta-book"
              className="btn-primary"
              onClick={onBook}
              style={{ cursor: 'pointer', border: 'none', font: 'inherit' }}
            >
              Book a Consultation
            </button>
            <a
              data-testid="hero-cta-whatsapp"
              className="btn-outline"
              href={`https://wa.me/${waNumber}`}
              target="_blank"
              rel="noreferrer"
            >
              WhatsApp Us
            </a>
          </div>
        )}

        {/* ── Pancha-Tattva Yantra glyphs ── */}
        <div style={{
          display: 'flex',
          gap: 'clamp(20px,4vw,48px)',
          justifyContent: 'center',
          marginTop: 64,
          flexWrap: 'wrap',
          alignItems: 'flex-end',
        }}>
          {YANTRA_ELEMENTS.map(item => (
            <div
              key={item.key}
              className="elem-float drawn"
              style={{ textAlign: 'center', opacity: 0.85 }}
            >
              <YantraGlyph shape={item.shape} bija={item.bija} />
              <div style={{
                fontFamily: "'Cormorant Garamond',serif",
                fontSize: 13, fontStyle: 'italic',
                color: 'var(--gold-light)', letterSpacing: '0.08em', marginTop: 10,
              }}>
                {item.sanskrit}
              </div>
              <div style={{
                fontFamily: "'DM Sans',sans-serif",
                fontSize: 9, color: '#6a5f50', letterSpacing: '0.22em',
                textTransform: 'uppercase', marginTop: 3,
              }}>
                {item.element}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Bottom fade gradient */}
      <div style={{
        position: 'absolute', bottom: 0, left: 0, right: 0, height: 120,
        background: 'linear-gradient(to bottom, transparent, var(--bg-deep))',
        pointerEvents: 'none',
      }} />
    </section>
  );
}

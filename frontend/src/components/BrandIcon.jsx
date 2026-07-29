export default function BrandIcon({ size = 40 }) {
  const showArcs = size >= 64;

  return (
    <svg width={size} height={size} viewBox="0 0 200 200" style={{ borderRadius: size >= 32 ? 8 : 4, flexShrink: 0 }}>
      <defs>
        <linearGradient id="bi-gold" x1="0.15" y1="0" x2="0.85" y2="1">
          <stop offset="0%" stopColor="#fff6df" />
          <stop offset="16%" stopColor="#f0cf82" />
          <stop offset="38%" stopColor="#d19a42" />
          <stop offset="58%" stopColor="#a9702f" />
          <stop offset="78%" stopColor="#7a4a2e" />
          <stop offset="100%" stopColor="#3b2114" />
        </linearGradient>
        <radialGradient id="bi-glow" cx="50%" cy="45%" r="50%">
          <stop offset="0%" stopColor="#c98a42" stopOpacity="0.3" />
          <stop offset="60%" stopColor="#c98a42" stopOpacity="0.06" />
          <stop offset="100%" stopColor="#c98a42" stopOpacity="0" />
        </radialGradient>
        <radialGradient id="bi-bg" cx="50%" cy="45%" r="60%">
          <stop offset="0%" stopColor="#1e1a14" />
          <stop offset="100%" stopColor="#111009" />
        </radialGradient>
        <radialGradient id="bi-hl" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="#ffffff" stopOpacity="0.5" />
          <stop offset="100%" stopColor="#ffffff" stopOpacity="0" />
        </radialGradient>
        <filter id="bi-shadow" x="-40%" y="-40%" width="180%" height="180%">
          <feDropShadow dx="0" dy="3" stdDeviation="3.2" floodColor="#000000" floodOpacity="0.38" />
        </filter>
        {showArcs && <>
          <linearGradient id="bi-agni" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#fff0d2" /><stop offset="16%" stopColor="#ffb14e" /><stop offset="58%" stopColor="#e8541f" /><stop offset="100%" stopColor="#8f2410" />
          </linearGradient>
          <linearGradient id="bi-jal" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="#e8f9ff" /><stop offset="18%" stopColor="#7fd4f2" /><stop offset="62%" stopColor="#2f7bc4" /><stop offset="100%" stopColor="#153c6e" />
          </linearGradient>
          <linearGradient id="bi-vayu" x1="1" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#f2fbff" /><stop offset="18%" stopColor="#c8ecf7" /><stop offset="62%" stopColor="#63b2dd" /><stop offset="100%" stopColor="#286a9c" />
          </linearGradient>
          <linearGradient id="bi-prithvi" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="#eaf6c8" /><stop offset="18%" stopColor="#b6da6a" /><stop offset="62%" stopColor="#4e8a3c" /><stop offset="100%" stopColor="#204418" />
          </linearGradient>
          <linearGradient id="bi-akash" x1="1" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#cfa9ef" /><stop offset="60%" stopColor="#7b5ea7" /><stop offset="100%" stopColor="#45306e" />
          </linearGradient>
        </>}
      </defs>

      {/* Dark background with warm glow */}
      <rect width="200" height="200" fill="url(#bi-bg)" />
      <rect width="200" height="200" fill="url(#bi-glow)" />

      {/* Arcs (only at larger sizes) */}
      {showArcs && (
        <g fill="none" strokeWidth="11" strokeLinecap="round" filter="url(#bi-shadow)">
          <path d="M 63.4,31.1 A 78 78 0 0 1 136.6,31.1" stroke="url(#bi-akash)" />
          <path d="M 154.2,43.9 A 78 78 0 0 1 176.8,113.5" stroke="url(#bi-vayu)" />
          <path d="M 170.1,134.2 A 78 78 0 0 1 110.9,177.2" stroke="url(#bi-agni)" />
          <path d="M 89.1,177.2 A 78 78 0 0 1 29.9,134.2" stroke="url(#bi-jal)" />
          <path d="M 23.2,113.5 A 78 78 0 0 1 45.8,43.9" stroke="url(#bi-prithvi)" />
          {/* Inner white highlight */}
          <g transform="translate(100,100) scale(0.9423) translate(-100,-100)" fill="none" stroke="#ffffff" strokeWidth="2.8" strokeLinecap="round" opacity="0.35">
            <path d="M 63.4,31.1 A 78 78 0 0 1 136.6,31.1" />
            <path d="M 154.2,43.9 A 78 78 0 0 1 176.8,113.5" />
            <path d="M 170.1,134.2 A 78 78 0 0 1 110.9,177.2" />
            <path d="M 89.1,177.2 A 78 78 0 0 1 29.9,134.2" />
            <path d="M 23.2,113.5 A 78 78 0 0 1 45.8,43.9" />
          </g>
        </g>
      )}

      {/* Gold lotus — scaled for center */}
      <g transform={showArcs ? "translate(100,104) scale(0.58) translate(-100,-100)" : "translate(100,100) scale(0.85) translate(-100,-100)"}>
        <circle cx="100" cy="90" r="64" fill="url(#bi-glow)" />
        <path d="M 44,130 A 68 68 0 1 1 156,130" fill="none" stroke="url(#bi-gold)" strokeWidth="5" strokeLinecap="round" />
        <path d="M 49,120.5 A 68 68 0 0 1 151,120.5" fill="none" stroke="#fff6df" strokeWidth="1.3" strokeLinecap="round" opacity="0.5" />
        <circle cx="44" cy="130" r="5.5" fill="url(#bi-gold)" />
        <circle cx="156" cy="130" r="5.5" fill="url(#bi-gold)" />
        <g fill="url(#bi-gold)" stroke="#3b2114" strokeWidth="0.6" strokeOpacity="0.35">
          <path d="M 100,52 C 111,68 113,90 100,110 C 87,90 89,68 100,52 Z" />
          <path d="M 98,107 C 83,101 71,86 69,64 C 85,72 96,88 98,107 Z" />
          <path d="M 102,107 C 117,101 129,86 131,64 C 115,72 104,88 102,107 Z" />
          <path d="M 96,111 C 79,110 62,102 52,86 C 68,88 86,98 96,111 Z" />
          <path d="M 104,111 C 121,110 138,102 148,86 C 132,88 114,98 104,111 Z" />
          <rect x="-4.5" y="-4.5" width="9" height="9" transform="translate(100,126) rotate(45)" />
        </g>
        <circle cx="100" cy="63" r="7" fill="url(#bi-hl)" />
        <circle cx="76" cy="76" r="5" fill="url(#bi-hl)" />
        <circle cx="124" cy="76" r="5" fill="url(#bi-hl)" />
        <circle cx="64" cy="94" r="4" fill="url(#bi-hl)" />
        <circle cx="136" cy="94" r="4" fill="url(#bi-hl)" />
        <circle cx="100" cy="126" r="2.6" fill="#fff6df" opacity="0.9" />
      </g>

      {/* Element glyph discs — dark background with gold border */}
      {showArcs && (
        <g>
          {[
            { x: 100, y: 22, color: '#7b5ea7', glyph: 'M -6,-6 A 8,8 0 1 1 -6,7||M 3,-3.2 A 3.7,3.7 0 1 0 2.6,3.9' },
            { x: 174.2, y: 75.9, color: '#2f7bb5', glyph: 'M -9,-4.2 Q -2,-8 6,-4.4||M -9.5,0.3 Q -1.5,-3.6 7.5,0.6||M -9,4.8 Q -2.5,1.3 4.5,5.2' },
            { x: 145.8, y: 163.1, color: '#c9481f', glyph: 'AGNI' },
            { x: 54.2, y: 163.1, color: '#1a4a86', glyph: 'JAL' },
            { x: 25.8, y: 75.9, color: '#3d6b2e', glyph: 'PRITHVI' },
          ].map((el, i) => (
            <g key={i} transform={`translate(${el.x},${el.y})`}>
              <circle r="12.5" fill="#1e1a14" stroke="#c1913e" strokeWidth="1.2" />
              <circle r="10" fill="none" stroke={el.color} strokeWidth="0.8" opacity="0.6" />
              {/* Simplified glyph dot at small sizes */}
              <circle r="4" fill={el.color} opacity="0.9" />
            </g>
          ))}
        </g>
      )}

      {/* Subtle border */}
      <rect x="0.5" y="0.5" width="199" height="199" rx="12" fill="none" stroke="rgba(200,136,58,0.15)" strokeWidth="1" />
    </svg>
  );
}

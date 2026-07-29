import SectionHeading from './SectionHeading';
import MandalaDivider from './MandalaDivider';

const STATS = [
  { target: '1000', suffix: '+', label: 'Homes Harmonized' },
  { target: '9',    suffix: '+', label: 'Years of Practice' },
  { target: '95',   suffix: '%', label: 'Demolition-Free' },
];

const PORTRAIT = 'https://static.prod-images.emergentagent.com/jobs/ad813907-9d03-4937-bb0d-291c419b334b/images/213c75d05e29fb068e3f3e9901a29e6af56e61d7cb7e04d69e4dc3035f5178d0.png';

export default function About() {
  return (
    <section
      id="about"
      data-testid="about-section"
      style={{
        background: 'var(--bg-deep)',
        padding: 'clamp(60px,8vw,100px) clamp(20px,6vw,80px)',
        position: 'relative', overflow: 'hidden',
      }}
    >
      {/* Subtle background texture */}
      <div style={{
        position: 'absolute', inset: 0, opacity: 0.04,
        backgroundImage: `url(https://static.prod-images.emergentagent.com/jobs/ad813907-9d03-4937-bb0d-291c419b334b/images/1c9897868d3945551fcda997ab549c070e90e8b1945a128a7696e06ffb5a9163.png)`,
        backgroundSize: 'cover', backgroundPosition: 'center',
        pointerEvents: 'none',
      }} />

      <div style={{ maxWidth: 1100, margin: '0 auto', position: 'relative', zIndex: 1 }}>
        <div className="reveal"><SectionHeading tag="About the Consultant" title="Meet Bindiya Agrawal" /></div>

        <div className="two-col" style={{ display: 'grid', gridTemplateColumns: '1fr 1.2fr', gap: 64, alignItems: 'center' }}>
          {/* Portrait */}
          <div className="reveal" style={{ position: 'relative' }}>
            <div style={{
              aspectRatio: '3/4',
              borderRadius: 4,
              overflow: 'hidden',
              border: '1px solid var(--border)',
              maxWidth: 380,
            }}>
              <img
                src={PORTRAIT}
                alt="Bindiya Agrawal — Vastu Astro Consultant"
                style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                loading="lazy"
              />
            </div>
            {/* Corner accents */}
            {[['tl', 0, 0], ['tr', 0, 'auto'], ['bl', 'auto', 0], ['br', 'auto', 'auto']].map(([k, t, r]) => (
              <div key={k} style={{
                position: 'absolute',
                top: typeof t === 'number' ? -8 : 'auto',
                bottom: t === 'auto' ? -8 : 'auto',
                left: r === 'auto' ? 'auto' : -8,
                right: r !== 'auto' ? 'auto' : -8,
                width: 20, height: 20,
                borderTop: (k === 'tl' || k === 'tr') ? '2px solid var(--gold)' : 'none',
                borderBottom: (k === 'bl' || k === 'br') ? '2px solid var(--gold)' : 'none',
                borderLeft: (k === 'tl' || k === 'bl') ? '2px solid var(--gold)' : 'none',
                borderRight: (k === 'tr' || k === 'br') ? '2px solid var(--gold)' : 'none',
              }} />
            ))}
          </div>

          {/* Bio */}
          <div className="reveal">
            <h2 style={{
              fontFamily: "'Cormorant Garamond',serif",
              fontSize: 'clamp(28px,4vw,46px)',
              fontWeight: 300, color: 'var(--cream)', lineHeight: 1.2, marginBottom: 20,
            }}>
              Bindiya Agrawal
            </h2>
            <div style={{ marginBottom: 20 }}>
              <span style={{
                fontFamily: "'DM Sans',sans-serif", fontSize: 10,
                letterSpacing: '0.2em', textTransform: 'uppercase',
                color: 'var(--terra-light)',
              }}>
                Certified Vastu Consultant · Acharya in Swara Shastra
              </span>
            </div>

            <p style={{
              fontFamily: "'Cormorant Garamond',serif", fontSize: 20,
              fontStyle: 'italic', color: 'var(--gold)', lineHeight: 1.5, marginBottom: 20,
            }}>
              "When your space aligns with the cosmos, life flows with effortless harmony."
            </p>

            <p style={{
              fontFamily: "'DM Sans',sans-serif", fontSize: 14,
              color: 'var(--cream-dim)', lineHeight: 1.9, fontWeight: 300, marginBottom: 16,
            }}>
              With deep roots in Vedic tradition and years of practical experience, I am a certified
              Vastu consultant and Acharya in Swara Shastra. I bridge ancient wisdom with modern
              living through a holistic approach that addresses not only the physical space, but also
              the energetic and cosmic influences that shape health, wealth, and relationships.
            </p>

            <p style={{
              fontFamily: "'DM Sans',sans-serif", fontSize: 14,
              color: 'var(--cream-dim)', lineHeight: 1.9, fontWeight: 300, marginBottom: 36,
            }}>
              Every consultation I offer is deeply personalized. I cross-reference your Kundli with
              your space to provide solutions that are precise, practical, and enduring. No unnecessary
              renovations — just simple, effective remedies that truly work.
            </p>

            {/* Stats */}
            <div style={{ display: 'flex', gap: 40, flexWrap: 'wrap' }}>
              {STATS.map(s => (
                <div key={s.label}>
                  <div className="stat-num" style={{
                    fontFamily: "'DM Sans',sans-serif", fontSize: 36, fontWeight: 500, lineHeight: 1,
                  }}>
                    {s.target}{s.suffix}
                  </div>
                  <div style={{
                    fontFamily: "'DM Sans',sans-serif", fontSize: 11,
                    color: '#6a5e50', letterSpacing: '0.1em', textTransform: 'uppercase', marginTop: 4,
                  }}>
                    {s.label}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

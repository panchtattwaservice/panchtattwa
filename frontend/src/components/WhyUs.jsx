import StarField from './StarField';
import SectionHeading from './SectionHeading';

// Unicode symbols exactly as in original design
const POINTS = [
  { sym: '◈', title: 'Expert Vastu Guidance',       desc: 'Rooted in authentic Vedic principles. Every recommendation is grounded in classical Vastu Shastra and verified through Swara Astrology.' },
  { sym: '◉', title: 'Home · Villa · Plot · Office', desc: 'Comprehensive solutions for residential, commercial, and industrial spaces — from plot selection to complete property analysis.' },
  { sym: '◬', title: 'Minimal Intervention',         desc: 'Wherever possible, I recommend simple, practical remedies you can apply yourself — no major renovations, no structural changes. Demolition is suggested only when truly essential.' },
  { sym: '⊛', title: 'Personalised to Your Kundli',  desc: 'Your birth chart cross-referenced with your space for a holistic, deeply individualized solution accounting for your unique planetary influences.' },
  { sym: '◯', title: 'Online & Offline',              desc: 'Consult from anywhere in the world via our online Swara Vastu process, or invite our expert for an in-person site visit.' },
  { sym: '◈', title: 'Our Promise',                  desc: 'Practical solutions with minimal alterations. No pressure. No unnecessary renovations. Simple DIY remedies that truly work.' },
];

export default function WhyUs() {
  return (
    <section
      id="why-us"
      data-testid="why-us-section"
      style={{
        background: 'var(--bg-mid)',
        padding: 'clamp(60px,8vw,100px) clamp(20px,6vw,80px)',
        position: 'relative', overflow: 'hidden',
      }}
    >
      <StarField count={50} />
      <div style={{ maxWidth: 1100, margin: '0 auto', position: 'relative', zIndex: 1 }}>
        <div className="reveal">
          <SectionHeading tag="Why PanchTattwa" title="Why Choose Us?" />
        </div>
        <div
          className="stagger"
          style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(280px,1fr))', gap: 32 }}
        >
          {POINTS.map(p => (
            <div key={p.title} className="why-card" style={{ display: 'flex', gap: 20, alignItems: 'flex-start' }}>
              <div className="why-icon">{p.sym}</div>
              <div>
                <h4 style={{ fontFamily: "'Cormorant Garamond',serif", fontSize: 19, fontWeight: 500, color: 'var(--cream)', marginBottom: 6 }}>
                  {p.title}
                </h4>
                <p style={{ fontFamily: "'DM Sans',sans-serif", fontSize: 13, color: 'var(--cream-dim)', lineHeight: 1.75, fontWeight: 300 }}>
                  {p.desc}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

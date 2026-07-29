import StarField from './StarField';
import SectionHeading from './SectionHeading';

// Unicode symbols exactly as in original design
const SERVICES = [
  { icon: '⌂', title: 'Home Vastu',          desc: 'Complete energy assessment for all types of residences. Identify imbalances, unlock positive flow, and restore harmony to your living space.' },
  { icon: '◫', title: 'Office Vastu',         desc: 'Align your workspace for productivity, prosperity and growth. Applicable to startups, corporate offices and commercial buildings.' },
  { icon: '◻', title: 'Plot & Site Vastu',    desc: 'Expert guidance on plot selection or selling. I read the energy of the land directly through my Swara — no instruments or machines — and evaluate direction, shape, and surrounding energies before you invest.' },
  { icon: '☿', title: 'Astrology Reading',    desc: 'In-depth Kundli analysis to understand planetary influences on your health, career, relationships, and finances.' },
  { icon: '◎', title: 'Online Consultation',  desc: 'Expert Swara Vastu assessment from anywhere in the world. Send your floor plan, GPS coordinates, and entrance degree — receive a comprehensive, personalized report.' },
  { icon: '⊙', title: 'Factory & Industrial', desc: 'Vastu solutions tailored for manufacturing units and industrial spaces. Optimize energy for safety, output, and workforce well-being.' },
];

export default function Services() {
  return (
    <section
      id="services"
      data-testid="services-section"
      style={{
        background: 'var(--bg-mid)',
        padding: 'clamp(60px,8vw,100px) clamp(20px,6vw,80px)',
        position: 'relative', overflow: 'hidden',
      }}
    >
      <StarField count={60} />
      <div style={{ maxWidth: 1100, margin: '0 auto', position: 'relative', zIndex: 1 }}>
        <div className="reveal">
          <SectionHeading
            tag="What We Offer"
            title="Our Services"
            subtitle="Ancient wisdom, applied to the spaces you live and work in — with practical, non-invasive remedies."
          />
        </div>
        <div
          className="stagger"
          style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(300px,1fr))', gap: 24 }}
        >
          {SERVICES.map(s => (
            <div key={s.title} className="service-card" data-testid={`service-${s.title.toLowerCase().replace(/\s+/g,'-').replace(/[^a-z0-9-]/g,'')}`}>
              <div style={{ fontSize: 28, color: 'var(--gold)', marginBottom: 16, lineHeight: 1 }}>{s.icon}</div>
              <h3 style={{ fontFamily: "'Cormorant Garamond',serif", fontSize: 22, fontWeight: 400, color: 'var(--cream)', marginBottom: 12 }}>
                {s.title}
              </h3>
              <p style={{ fontFamily: "'DM Sans',sans-serif", fontSize: 13, color: 'var(--cream-dim)', lineHeight: 1.8, fontWeight: 300 }}>
                {s.desc}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

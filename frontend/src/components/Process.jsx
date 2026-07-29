import SectionHeading from './SectionHeading';

const STEPS = [
  { n: '01', title: 'Initial Enquiry', desc: "Contact us by phone, WhatsApp, or through the contact form. We'll understand your needs and suggest the most suitable consultation type." },
  { n: '02', title: 'Advance Booking', desc: "Confirm your appointment and complete the advance payment. We'll schedule your consultation at a date and time that works best for you." },
  { n: '03', title: 'Submit Documents', desc: 'Share your floor plan, GPS location, entrance direction, and Kundli details. For online consultations, we may also request photos or videos.' },
  { n: '04', title: 'Expert Analysis', desc: 'I will perform a thorough Vastu and Swara Astrology assessment, identifying energy blockages and cosmic misalignments in your space.' },
  { n: '05', title: 'Personalized Report', desc: "Receive a detailed report with room-by-room findings, simple remedies, and priority action steps. Practical fixes first, structural changes only when truly necessary." },
  { n: '06', title: 'Follow-Up Support', desc: "I'll remain available to answer your questions and guide the implementation. Your journey toward harmonized living continues beyond the consultation." },
];

export default function Process() {
  return (
    <section
      id="process"
      data-testid="process-section"
      style={{ background: 'var(--bg-deep)', padding: 'clamp(60px,8vw,100px) clamp(20px,6vw,80px)' }}
    >
      <div style={{ maxWidth: 1100, margin: '0 auto' }}>
        <div className="reveal">
          <SectionHeading
            tag="How It Works"
            title="Our Consultation Process"
            subtitle="A clear, structured journey from first contact to a harmonized space."
          />
        </div>
        <div
          className="stagger"
          style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(300px,1fr))', gap: 2 }}
        >
          {STEPS.map((s) => (
            <div key={s.n} className="step-card" data-testid={`process-step-${s.n}`}>
              <div className="step-num">{s.n}</div>
              <div style={{
                width: 40, height: 2,
                background: 'linear-gradient(90deg, var(--terra), var(--gold))',
                marginBottom: 20,
              }} />
              <h3 style={{
                fontFamily: "'Cormorant Garamond',serif",
                fontSize: 22, fontWeight: 400, color: 'var(--cream)',
                marginBottom: 12, position: 'relative',
              }}>
                {s.title}
              </h3>
              <p style={{
                fontFamily: "'DM Sans',sans-serif", fontSize: 13,
                color: 'var(--cream-dim)', lineHeight: 1.8, fontWeight: 300,
              }}>
                {s.desc}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

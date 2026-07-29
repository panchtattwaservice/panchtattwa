import { useState } from 'react';
import StarField from './StarField';
import SectionHeading from './SectionHeading';

const TESTIMONIALS = [
  { name: 'Priya Sharma',  location: 'Mumbai',    quote: "After the Vastu consultation, the energy in our home shifted completely. Financial blocks cleared, and there's a new sense of peace and positivity. Highly recommend Bindiya ji." },
  { name: 'Rajesh Mehta',  location: 'Bengaluru', quote: "Our office was facing constant delays and team friction. After the consultation, things turned around remarkably within two months. The remedies were simple but powerful." },
  { name: 'Sunita Gupta',  location: 'Delhi',     quote: "I was skeptical at first, but the online consultation was incredibly thorough. Bindiya ji explained everything with patience and the solutions were easy to implement. Life feels more aligned now." },
  { name: 'Anil Verma',    location: 'Pune',      quote: "The plot selection guidance saved us from a potentially troublesome investment. The analysis was precise and the advice was practical. Truly grateful for the expertise." },
];

export default function Testimonials() {
  const [active, setActive] = useState(0);

  return (
    <section
      id="testimonials"
      data-testid="testimonials-section"
      style={{
        background: 'var(--bg-mid)',
        padding: 'clamp(60px,8vw,100px) clamp(20px,6vw,80px)',
        position: 'relative', overflow: 'hidden',
      }}
    >
      <StarField count={40} />
      <div style={{ maxWidth: 800, margin: '0 auto', position: 'relative', zIndex: 1 }}>
        <div className="reveal">
          <SectionHeading tag="Client Experiences" title="What Our Clients Say" />
        </div>

        {/* Quote card — no arrows, just dots as in original */}
        <div
          className="reveal-scale"
          style={{
            background: 'var(--bg-card)',
            border: '1px solid var(--border)',
            borderRadius: 4,
            padding: '48px 52px',
            textAlign: 'center',
            position: 'relative',
            marginBottom: 40,
          }}
        >
          {/* Decorative opening quote */}
          <div style={{
            position: 'absolute', top: 24, left: 32,
            fontSize: 64, color: '#2a231a', lineHeight: 1,
            fontFamily: 'Georgia', userSelect: 'none',
          }}>"</div>

          <p
            data-testid="testimonial-quote"
            style={{
              fontFamily: "'Cormorant Garamond',serif",
              fontSize: 'clamp(18px,2.5vw,22px)',
              fontStyle: 'italic',
              color: 'var(--cream)',
              lineHeight: 1.7,
              marginBottom: 28,
              position: 'relative', zIndex: 1,
            }}
          >
            {TESTIMONIALS[active].quote}
          </p>

          <div style={{ width: 40, height: 1, background: 'var(--gold)', margin: '0 auto 16px' }} />

          <p style={{ fontFamily: "'Cormorant Garamond',serif", fontSize: 18, fontWeight: 500, color: 'var(--gold)' }}>
            {TESTIMONIALS[active].name}
          </p>
          <p style={{
            fontFamily: "'DM Sans',sans-serif", fontSize: 11,
            color: '#5a4e40', letterSpacing: '0.1em', textTransform: 'uppercase', marginTop: 4,
          }}>
            {TESTIMONIALS[active].location}
          </p>
        </div>

        {/* Dots navigation — no arrows, exactly as original */}
        <div style={{ display: 'flex', gap: 12, justifyContent: 'center' }}>
          {TESTIMONIALS.map((_, i) => (
            <button
              key={i}
              data-testid={`testimonial-dot-${i}`}
              className="t-dot"
              onClick={() => setActive(i)}
              aria-label={`Testimonial ${i + 1}`}
              style={{
                width: i === active ? 28 : 8,
                background: i === active ? 'var(--gold)' : '#2a2418',
              }}
            />
          ))}
        </div>
      </div>
    </section>
  );
}

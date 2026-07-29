import { useState, useEffect, useCallback, useRef } from 'react';
import StarField from './StarField';
import SectionHeading from './SectionHeading';

const TESTIMONIALS = [
  { name: 'Priya Sharma',  location: 'Mumbai',    quote: "After the Vastu consultation, the energy in our home shifted completely. Financial blocks cleared, and there's a new sense of peace and positivity. Highly recommend Bindiya ji." },
  { name: 'Rajesh Mehta',  location: 'Bengaluru', quote: "Our office was facing constant delays and team friction. After the consultation, things turned around remarkably within two months. The remedies were simple but powerful." },
  { name: 'Sunita Gupta',  location: 'Delhi',     quote: "I was skeptical at first, but the online consultation was incredibly thorough. Bindiya ji explained everything with patience and the solutions were easy to implement. Life feels more aligned now." },
  { name: 'Anil Verma',    location: 'Pune',      quote: "The plot selection guidance saved us from a potentially troublesome investment. The analysis was precise and the advice was practical. Truly grateful for the expertise." },
];

const AUTO_INTERVAL = 10000;

export default function Testimonials() {
  const [active, setActive] = useState(0);
  const [paused, setPaused] = useState(false);
  const timerRef = useRef(null);

  const goTo = useCallback((i) => {
    setActive(i);
    setPaused(true);
    // Resume auto-scroll after 20s of inactivity
    clearTimeout(timerRef.current);
    timerRef.current = setTimeout(() => setPaused(false), 20000);
  }, []);

  // Auto-advance every 10s
  useEffect(() => {
    if (paused) return;
    const id = setInterval(() => {
      setActive((prev) => (prev + 1) % TESTIMONIALS.length);
    }, AUTO_INTERVAL);
    return () => clearInterval(id);
  }, [paused]);

  // Cleanup on unmount
  useEffect(() => () => clearTimeout(timerRef.current), []);

  // Swipe support
  const touchStart = useRef(null);
  const handleTouchStart = (e) => { touchStart.current = e.touches[0].clientX; };
  const handleTouchEnd = (e) => {
    if (touchStart.current === null) return;
    const diff = touchStart.current - e.changedTouches[0].clientX;
    if (Math.abs(diff) > 50) {
      const next = diff > 0
        ? (active + 1) % TESTIMONIALS.length
        : (active - 1 + TESTIMONIALS.length) % TESTIMONIALS.length;
      goTo(next);
    }
    touchStart.current = null;
  };

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

        {/* Quote card with swipe support */}
        <div
          className="reveal-scale"
          onTouchStart={handleTouchStart}
          onTouchEnd={handleTouchEnd}
          style={{
            background: 'var(--bg-card)',
            border: '1px solid var(--border)',
            borderRadius: 4,
            padding: '48px 52px',
            textAlign: 'center',
            position: 'relative',
            marginBottom: 40,
            cursor: 'grab',
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
            key={active}
            style={{
              fontFamily: "'Cormorant Garamond',serif",
              fontSize: 'clamp(18px,2.5vw,22px)',
              fontStyle: 'italic',
              color: 'var(--cream)',
              lineHeight: 1.7,
              marginBottom: 28,
              position: 'relative', zIndex: 1,
              animation: 'testimonial-fade 0.5s ease',
            }}
          >
            {TESTIMONIALS[active].quote}
          </p>

          <div style={{ width: 40, height: 1, background: 'var(--gold)', margin: '0 auto 16px' }} />

          <p key={`name-${active}`} style={{ fontFamily: "'Cormorant Garamond',serif", fontSize: 18, fontWeight: 500, color: 'var(--gold)', animation: 'testimonial-fade 0.5s ease' }}>
            {TESTIMONIALS[active].name}
          </p>
          <p style={{
            fontFamily: "'DM Sans',sans-serif", fontSize: 11,
            color: '#5a4e40', letterSpacing: '0.1em', textTransform: 'uppercase', marginTop: 4,
          }}>
            {TESTIMONIALS[active].location}
          </p>
        </div>

        {/* Arrow + Dots navigation */}
        <div style={{ display: 'flex', gap: 12, justifyContent: 'center', alignItems: 'center' }}>
          <button
            data-testid="testimonial-prev"
            onClick={() => goTo((active - 1 + TESTIMONIALS.length) % TESTIMONIALS.length)}
            aria-label="Previous testimonial"
            style={{ background: 'none', border: '1px solid var(--border)', color: 'var(--cream-dim)', width: 32, height: 32, borderRadius: '50%', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', transition: 'all .25s', flexShrink: 0 }}
            onMouseEnter={e => { e.currentTarget.style.borderColor = 'var(--gold)'; e.currentTarget.style.color = 'var(--gold)'; }}
            onMouseLeave={e => { e.currentTarget.style.borderColor = 'var(--border)'; e.currentTarget.style.color = 'var(--cream-dim)'; }}
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M15 18l-6-6 6-6" /></svg>
          </button>

          {TESTIMONIALS.map((_, i) => (
            <button
              key={i}
              data-testid={`testimonial-dot-${i}`}
              className="t-dot"
              onClick={() => goTo(i)}
              aria-label={`Testimonial ${i + 1}`}
              style={{
                width: i === active ? 28 : 8,
                background: i === active ? 'var(--gold)' : '#2a2418',
              }}
            />
          ))}

          <button
            data-testid="testimonial-next"
            onClick={() => goTo((active + 1) % TESTIMONIALS.length)}
            aria-label="Next testimonial"
            style={{ background: 'none', border: '1px solid var(--border)', color: 'var(--cream-dim)', width: 32, height: 32, borderRadius: '50%', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', transition: 'all .25s', flexShrink: 0 }}
            onMouseEnter={e => { e.currentTarget.style.borderColor = 'var(--gold)'; e.currentTarget.style.color = 'var(--gold)'; }}
            onMouseLeave={e => { e.currentTarget.style.borderColor = 'var(--border)'; e.currentTarget.style.color = 'var(--cream-dim)'; }}
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M9 18l6-6-6-6" /></svg>
          </button>
        </div>
      </div>

      <style>{`
        @keyframes testimonial-fade {
          from { opacity: 0; transform: translateY(8px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </section>
  );
}

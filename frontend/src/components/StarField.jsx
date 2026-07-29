import { useRef, useMemo } from 'react';

export default function StarField({ count = 100 }) {
  const starsRef = useRef(null);
  if (!starsRef.current) {
    starsRef.current = Array.from({ length: count }, () => ({
      x: Math.random() * 100,
      y: Math.random() * 100,
      r: Math.random() * 1.5 + 0.3,
      o: parseFloat((Math.random() * 0.5 + 0.2).toFixed(2)),
      dur: parseFloat((Math.random() * 4 + 3).toFixed(1)),
      delay: parseFloat((Math.random() * 6).toFixed(1)),
    }));
  }

  return (
    <svg
      aria-hidden="true"
      style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', pointerEvents: 'none' }}
    >
      {starsRef.current.map((s, i) => (
        <circle
          key={i}
          cx={`${s.x}%`}
          cy={`${s.y}%`}
          r={s.r}
          fill="#e8dfc8"
          className="star"
          style={{ '--so': s.o, '--sd': `${s.dur}s`, '--ss': `${s.delay}s`, opacity: s.o }}
        />
      ))}
    </svg>
  );
}

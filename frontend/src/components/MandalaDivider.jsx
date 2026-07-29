export default function MandalaDivider() {
  const pts = [0, 45, 90, 135, 180, 225, 270, 315];
  const dots = [0, 60, 120, 180, 240, 300];
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 16, margin: '0 auto', maxWidth: 480, padding: '8px 0' }}>
      <div style={{ flex: 1, height: 1, background: 'linear-gradient(to right, transparent, var(--gold))' }} />
      <svg width="32" height="32" viewBox="0 0 32 32" fill="none" className="mandala-svg mandala-spin">
        <circle cx="16" cy="16" r="6" stroke="var(--gold)" strokeWidth="0.8" fill="none" />
        <circle cx="16" cy="16" r="12" stroke="var(--gold)" strokeWidth="0.5" fill="none" strokeDasharray="2 3" />
        {pts.map((a) => {
          const rad = (Math.PI * a) / 180;
          return (
            <line
              key={a}
              x1={(16 + Math.cos(rad) * 7).toFixed(2)}
              y1={(16 + Math.sin(rad) * 7).toFixed(2)}
              x2={(16 + Math.cos(rad) * 13).toFixed(2)}
              y2={(16 + Math.sin(rad) * 13).toFixed(2)}
              stroke="var(--gold)"
              strokeWidth="0.6"
            />
          );
        })}
        <circle cx="16" cy="16" r="2" fill="var(--gold)" />
        {dots.map((a) => {
          const rad = (Math.PI * a) / 180;
          return (
            <circle
              key={a}
              cx={(16 + Math.cos(rad) * 9).toFixed(2)}
              cy={(16 + Math.sin(rad) * 9).toFixed(2)}
              r="0.8"
              fill="var(--gold)"
            />
          );
        })}
      </svg>
      <div style={{ flex: 1, height: 1, background: 'linear-gradient(to left, transparent, var(--gold))' }} />
    </div>
  );
}

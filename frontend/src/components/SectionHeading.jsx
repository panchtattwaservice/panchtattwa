import MandalaDivider from './MandalaDivider';

export default function SectionHeading({ tag, title, subtitle }) {
  return (
    <div style={{ textAlign: 'center', marginBottom: 56 }}>
      {tag && (
        <p style={{
          fontFamily: "'DM Sans',sans-serif",
          fontSize: 11,
          letterSpacing: '0.22em',
          textTransform: 'uppercase',
          color: 'var(--terra-light)',
          marginBottom: 12,
        }}>
          {tag}
        </p>
      )}
      <h2
        className="shimmer-text"
        style={{
          fontFamily: "'Cormorant Garamond',serif",
          fontSize: 'clamp(30px,5vw,52px)',
          fontWeight: 300,
          lineHeight: 1.15,
          marginBottom: 16,
        }}
      >
        {title}
      </h2>
      <MandalaDivider />
      {subtitle && (
        <p style={{
          marginTop: 20,
          fontFamily: "'DM Sans',sans-serif",
          fontSize: 15,
          color: 'var(--cream-dim)',
          maxWidth: 560,
          margin: '20px auto 0',
          lineHeight: 1.7,
          fontWeight: 300,
        }}>
          {subtitle}
        </p>
      )}
    </div>
  );
}

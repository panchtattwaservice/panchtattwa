import { useEffect, useState } from 'react';

// ── Provider SVG icons (exact from original design) ─────────────────────────
function ProviderIcon({ provider }) {
  if (provider === 'google') return (
    <svg viewBox="0 0 24 24" width="18" height="18" style={{ flexShrink: 0 }}>
      <path fill="#EA4335" d="M12 5c1.6 0 3.1.6 4.2 1.6l3.1-3.1C17.4 1.6 14.9.6 12 .6 7.4.6 3.4 3.2 1.4 7.1l3.6 2.8C6 7 8.8 5 12 5z"/>
      <path fill="#4285F4" d="M23.5 12.3c0-.8-.1-1.6-.2-2.3H12v4.5h6.5c-.3 1.5-1.1 2.7-2.3 3.5l3.6 2.8c2.1-1.9 3.7-4.8 3.7-8.5z"/>
      <path fill="#FBBC05" d="M5 14.4c-.2-.6-.3-1.2-.3-1.9s.1-1.3.3-1.9L1.4 7.8C.5 9.2 0 10.9 0 12.5s.5 3.3 1.4 4.7L5 14.4z"/>
      <path fill="#34A853" d="M12 24c3.2 0 5.9-1 7.9-2.8l-3.6-2.8c-1 .7-2.3 1.1-4.3 1.1-3.2 0-6-2-7-4.9l-3.6 2.8C3.4 20.8 7.4 24 12 24z"/>
    </svg>
  );
  if (provider === 'apple') return (
    <svg viewBox="0 0 24 24" width="18" height="18" fill="#ede8df" style={{ flexShrink: 0 }}>
      <path d="M17.05 20.28c-.98.95-2.05.8-3.08.35-1.09-.46-2.09-.48-3.24 0-1.44.62-2.2.44-3.06-.35C2.79 15.25 3.51 7.59 9.05 7.31c1.35.07 2.29.74 3.08.8 1.18-.24 2.31-.93 3.57-.84 1.51.12 2.65.72 3.4 1.8-3.12 1.87-2.38 5.98.48 7.13-.57 1.5-1.31 2.99-2.54 4.09zM12.03 7.25c-.15-2.23 1.66-4.07 3.74-4.25.29 2.58-2.34 4.5-3.74 4.25z"/>
    </svg>
  );
  if (provider === 'x') return (
    <svg viewBox="0 0 24 24" width="18" height="18" fill="#ede8df" style={{ flexShrink: 0 }}>
      <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
    </svg>
  );
  if (provider === 'facebook') return (
    <svg viewBox="0 0 24 24" width="18" height="18" style={{ flexShrink: 0 }}>
      <path fill="#1877F2" d="M24 12c0-6.6-5.4-12-12-12S0 5.4 0 12c0 6 4.4 11 10.1 11.9V15.5H7.1V12h3.1V9.4c0-3 1.8-4.7 4.5-4.7 1.3 0 2.7.2 2.7.2v3h-1.5c-1.5 0-2 .9-2 1.9V12h3.3l-.5 3.5h-2.8v8.4C19.6 23 24 18 24 12z"/>
    </svg>
  );
  return null;
}

// ── Toast notification ────────────────────────────────────────────────────────
function Toast({ message, onDismiss }) {
  useEffect(() => {
    const t = setTimeout(onDismiss, 4000);
    return () => clearTimeout(t);
  }, [onDismiss]);
  return (
    <div style={{
      position: 'fixed', bottom: 24, left: '50%', transform: 'translateX(-50%)',
      background: '#1e1a14', border: '1px solid var(--gold)',
      borderRadius: 4, padding: '12px 22px', zIndex: 999,
      fontFamily: "'DM Sans',sans-serif", fontSize: 13, color: 'var(--cream)',
      boxShadow: '0 10px 36px rgba(0,0,0,0.7)',
      animation: 'fade-up 0.3s ease-out',
      whiteSpace: 'nowrap',
    }}>
      <span style={{ color: 'var(--gold)', marginRight: 8 }}>◆</span>
      {message}
    </div>
  );
}

// ── Provider button ───────────────────────────────────────────────────────────
function ProviderBtn({ providerKey, label, onClick, testId, style = {} }) {
  return (
    <button
      data-testid={testId}
      onClick={onClick}
      style={{
        display: 'flex', alignItems: 'center', gap: 14,
        padding: '13px 20px', borderRadius: 3, width: '100%',
        background: 'rgba(255,255,255,0.03)',
        border: '1px solid var(--border)',
        color: 'var(--cream)', cursor: 'pointer',
        fontFamily: "'DM Sans',sans-serif", fontSize: 13.5, fontWeight: 400,
        transition: 'all 0.22s',
        ...style,
      }}
      onMouseEnter={e => {
        e.currentTarget.style.background = 'rgba(200,136,58,0.08)';
        e.currentTarget.style.borderColor = 'var(--gold)';
        e.currentTarget.style.transform = 'translateY(-1px)';
      }}
      onMouseLeave={e => {
        e.currentTarget.style.background = style.background || 'rgba(255,255,255,0.03)';
        e.currentTarget.style.borderColor = style.borderColor || 'var(--border)';
        e.currentTarget.style.transform = 'none';
      }}
    >
      {providerKey && <ProviderIcon provider={providerKey} />}
      <span>{label}</span>
    </button>
  );
}

// ── Divider ───────────────────────────────────────────────────────────────────
function Divider({ label }) {
  return (
    <div style={{
      display: 'flex', alignItems: 'center', gap: 12,
      margin: '4px 0',
    }}>
      <div style={{ flex: 1, height: 1, background: 'var(--border)' }} />
      <span style={{
        fontFamily: "'DM Sans',sans-serif", fontSize: 10,
        color: '#6a5e50', letterSpacing: '0.18em', textTransform: 'uppercase',
      }}>
        {label}
      </span>
      <div style={{ flex: 1, height: 1, background: 'var(--border)' }} />
    </div>
  );
}

// ── AuthModal ─────────────────────────────────────────────────────────────────
export default function AuthModal({ onClose }) {
  const [toast, setToast] = useState(null);

  // Lock body scroll
  useEffect(() => {
    const prev = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    const onKey = (e) => { if (e.key === 'Escape') onClose(); };
    document.addEventListener('keydown', onKey);
    return () => {
      document.body.style.overflow = prev;
      document.removeEventListener('keydown', onKey);
    };
  }, [onClose]);

  const handleGoogle = () => {
    // REMINDER: DO NOT HARDCODE THE URL, OR ADD ANY FALLBACKS OR REDIRECT URLS, THIS BREAKS THE AUTH
    const redirectUrl = window.location.origin;
    window.location.href = `https://auth.emergentagent.com/?redirect=${encodeURIComponent(redirectUrl)}`;
  };

  const handleSocialUnavailable = (providerName) => {
    setToast(`${providerName} login requires additional setup. Please use Google to continue.`);
  };

  // Social providers
  const providers = [
    {
      key: 'google',
      label: 'Continue with Google',
      testId: 'google-signin-btn',
      action: handleGoogle,
      available: true,
    },
    {
      key: 'apple',
      label: 'Continue with Apple',
      testId: 'apple-signin-btn',
      action: () => handleSocialUnavailable('Apple'),
      available: false,
    },
    {
      key: 'x',
      label: 'Continue with X',
      testId: 'x-signin-btn',
      action: () => handleSocialUnavailable('X'),
      available: false,
    },
    {
      key: 'facebook',
      label: 'Continue with Facebook',
      testId: 'facebook-signin-btn',
      action: () => handleSocialUnavailable('Facebook'),
      available: false,
    },
  ];

  return (
    <>
      <div
        data-testid="auth-modal-overlay"
        className="auth-overlay"
        onClick={onClose}
      >
        <div
          data-testid="auth-modal"
          className="auth-modal"
          onClick={e => e.stopPropagation()}
          role="dialog"
          aria-modal="true"
          aria-label="Sign in to PanchTattwa"
        >
          {/* Background mandala */}
          <svg
            className="auth-modal-mandala"
            viewBox="0 0 200 200"
            style={{
              position: 'absolute', top: -90, left: '50%',
              transform: 'translateX(-50%)', width: 360, height: 360,
              opacity: 0.07, pointerEvents: 'none',
            }}
          >
            <g fill="none" stroke="var(--gold)" strokeWidth="0.6">
              <circle cx="100" cy="100" r="85" />
              <circle cx="100" cy="100" r="68" />
              <circle cx="100" cy="100" r="52" />
              {[0, 30, 60, 90, 120, 150].map(a => {
                const r = (a * Math.PI) / 180;
                return (
                  <line key={a}
                    x1={100 + Math.cos(r) * 85} y1={100 + Math.sin(r) * 85}
                    x2={100 - Math.cos(r) * 85} y2={100 - Math.sin(r) * 85}
                  />
                );
              })}
              {[0, 45, 90, 135, 180, 225, 270, 315].map(a => {
                const r = (a * Math.PI) / 180;
                return <circle key={a} cx={100 + Math.cos(r) * 52} cy={100 + Math.sin(r) * 52} r="6" />;
              })}
            </g>
          </svg>

          <button
            data-testid="auth-modal-close"
            className="auth-close"
            onClick={onClose}
            aria-label="Close"
          >×</button>

          {/* Header */}
          <div style={{ textAlign: 'center', marginBottom: 28, position: 'relative' }}>
            <div style={{
              fontFamily: "'DM Sans',sans-serif", fontSize: 10,
              letterSpacing: '0.32em', color: 'var(--gold)',
              textTransform: 'uppercase', marginBottom: 14,
            }}>
              ◆ Welcome ◆
            </div>
            <div style={{
              fontFamily: "'Cormorant Garamond',serif", fontWeight: 300,
              fontSize: 32, color: 'var(--cream)', lineHeight: 1.1, marginBottom: 10,
            }}>
              Enter your{' '}
              <span style={{ fontStyle: 'italic', color: 'var(--gold)' }}>sacred space</span>
            </div>
            <div style={{
              fontFamily: "'Cormorant Garamond',serif", fontStyle: 'italic',
              fontSize: 14, color: 'var(--cream-dim)', maxWidth: 320, margin: '0 auto',
              lineHeight: 1.6,
            }}>
              Sign in to track consultations, view reports, and continue your journey toward harmonized living.
            </div>
          </div>

          {/* Social provider buttons */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10, marginBottom: 4 }}>
            {providers.map(p => (
              <div key={p.key} style={{ position: 'relative' }}>
                <ProviderBtn
                  providerKey={p.key}
                  label={p.label}
                  onClick={p.action}
                  testId={p.testId}
                  style={p.available ? {} : { opacity: 0.65 }}
                />
                {!p.available && (
                  <span style={{
                    position: 'absolute', top: 8, right: 10,
                    fontFamily: "'DM Sans',sans-serif", fontSize: 8,
                    letterSpacing: '0.18em', textTransform: 'uppercase',
                    color: '#5a4e40', padding: '2px 6px',
                    border: '1px solid #2a2418', borderRadius: 2,
                    pointerEvents: 'none',
                  }}>
                    soon
                  </span>
                )}
              </div>
            ))}
          </div>

          <Divider label="Or" />

          {/* Continue with Email (routes to Google per original design) */}
          <ProviderBtn
            label="Continue with Email"
            testId="email-signin-btn"
            onClick={handleGoogle}
            style={{
              justifyContent: 'center',
              background: 'transparent',
              borderColor: 'rgba(200,136,58,0.25)',
              color: 'var(--cream-dim)',
              fontSize: 12,
              letterSpacing: '0.06em',
            }}
          />

          {/* Consultant Sign-in */}
          <ProviderBtn
            label="Consultant Sign-in"
            testId="consultant-signin-btn"
            onClick={handleGoogle}
            style={{
              justifyContent: 'center',
              background: 'transparent',
              borderColor: 'rgba(200,136,58,0.35)',
              color: 'var(--gold-light)',
              fontSize: 11,
              letterSpacing: '0.18em',
              textTransform: 'uppercase',
              marginTop: 6,
            }}
          />

          <p style={{
            marginTop: 22,
            fontFamily: "'DM Sans',sans-serif", fontSize: 10.5,
            color: '#5a5045', textAlign: 'center', lineHeight: 1.7,
            letterSpacing: '0.04em', position: 'relative',
          }}>
            By continuing, you agree to our{' '}
            <span style={{ color: 'var(--cream-dim)' }}>Terms</span>{' '}and{' '}
            <span style={{ color: 'var(--cream-dim)' }}>Privacy Policy</span>.
          </p>
        </div>
      </div>

      {toast && <Toast message={toast} onDismiss={() => setToast(null)} />}
    </>
  );
}

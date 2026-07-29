import { useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import useAuth from '../hooks/useAuth';

const API = process.env.REACT_APP_BACKEND_URL + '/api';

export default function AuthCallback() {
  const navigate = useNavigate();
  const { processSession } = useAuth();
  const hasProcessed = useRef(false);

  useEffect(() => {
    // Use ref (not state) for processed flag to prevent race conditions under StrictMode
    if (hasProcessed.current) return;
    hasProcessed.current = true;

    const hash = window.location.hash;
    const sessionId = hash?.includes('session_id=')
      ? hash.split('session_id=')[1]?.split('&')[0]
      : null;

    if (!sessionId) {
      navigate('/', { replace: true });
      return;
    }

    (async () => {
      await processSession(sessionId);
      // Clear hash and navigate to main app
      window.history.replaceState(null, '', window.location.pathname);
      navigate('/', { replace: true });
    })();
  }, [navigate, processSession]);

  return (
    <div style={{
      minHeight: '100vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      background: '#111009',
      flexDirection: 'column',
      gap: 16,
    }}>
      <svg width="48" height="48" viewBox="0 0 32 32" fill="none" className="mandala-spin">
        <circle cx="16" cy="16" r="6" stroke="#c8883a" strokeWidth="0.8" fill="none" />
        <circle cx="16" cy="16" r="12" stroke="#c8883a" strokeWidth="0.5" fill="none" strokeDasharray="2 3" />
        <circle cx="16" cy="16" r="2" fill="#c8883a" />
      </svg>
      <p style={{ fontFamily: "'DM Sans',sans-serif", fontSize: 13, letterSpacing: '0.12em', color: '#b8af9f', textTransform: 'uppercase' }}>
        Signing in…
      </p>
    </div>
  );
}

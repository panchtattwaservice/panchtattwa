import { useState, useEffect, useCallback } from 'react';

const API = process.env.REACT_APP_BACKEND_URL + '/api';
const TOKEN_KEY = 'panchtattwa_session_token';

function getStoredToken() {
  try { return localStorage.getItem(TOKEN_KEY); } catch { return null; }
}

function storeToken(token) {
  try { localStorage.setItem(TOKEN_KEY, token); } catch {}
}

function clearToken() {
  try { localStorage.removeItem(TOKEN_KEY); } catch {}
}

function authHeaders() {
  const token = getStoredToken();
  const headers = { 'Cache-Control': 'no-cache' };
  if (token) headers['Authorization'] = `Bearer ${token}`;
  return headers;
}

export default function useAuth() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  const checkAuth = useCallback(async () => {
    const token = getStoredToken();
    if (!token) {
      setUser(null);
      setLoading(false);
      return;
    }
    try {
      const res = await fetch(`${API}/auth/me`, {
        credentials: 'include',
        headers: authHeaders(),
      });
      if (res.ok) {
        const data = await res.json();
        setUser(data);
      } else {
        setUser(null);
        clearToken();
      }
    } catch {
      setUser(null);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (window.location.hash?.includes('session_id=')) {
      setLoading(false);
      return;
    }
    checkAuth();
  }, [checkAuth]);

  const processSession = useCallback(async (sessionId) => {
    try {
      const res = await fetch(`${API}/auth/session`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ session_id: sessionId }),
      });
      if (res.ok) {
        const data = await res.json();
        if (data.session_token) {
          storeToken(data.session_token);
        }
        setUser(data);
        return data;
      }
    } catch (e) {
      console.error('Session exchange failed:', e);
    }
    return null;
  }, []);

  const signIn = useCallback(() => {
    const redirectUrl = window.location.origin;
    window.location.href = `https://auth.emergentagent.com/?redirect=${encodeURIComponent(redirectUrl)}`;
  }, []);

  const signOut = useCallback(async () => {
    try {
      await fetch(`${API}/auth/logout`, {
        method: 'POST',
        credentials: 'include',
        headers: authHeaders(),
      });
    } catch {}
    clearToken();
    setUser(null);
  }, []);

  return { user, loading, processSession, signIn, signOut, refetch: checkAuth };
}

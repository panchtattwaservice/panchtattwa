const TOKEN_KEY = 'panchtattwa_session_token';

export function authHeaders(extra = {}) {
  const headers = { ...extra };
  try {
    const token = localStorage.getItem(TOKEN_KEY);
    if (token) headers['Authorization'] = `Bearer ${token}`;
  } catch {}
  return headers;
}

export function authFetch(url, options = {}) {
  return fetch(url, {
    ...options,
    credentials: 'include',
    headers: {
      ...authHeaders(),
      ...options.headers,
    },
  });
}

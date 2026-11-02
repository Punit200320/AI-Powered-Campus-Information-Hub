import React, { useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

/**
 * Handles the OAuth2 redirect from the backend.
 * Backend issues the app's own JWT and redirects here as:
 *   /auth/callback?token=...&user=<url-encoded JSON>
 */
export const OAuthCallbackPage = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { ssoLogin } = useAuth();

  useEffect(() => {
    const token = searchParams.get('token');
    const userParam = searchParams.get('user');

    if (!token || !userParam) {
      navigate('/login', { replace: true });
      return;
    }

    try {
      const user = JSON.parse(decodeURIComponent(userParam));
      ssoLogin(user, token);
      navigate('/dashboard', { replace: true });
    } catch (err) {
      navigate('/login', { replace: true });
    }
  }, [navigate, searchParams, ssoLogin]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary-900/40 via-dark-surface to-secondary-950/40">
      <div className="text-center space-y-3">
        <div className="mx-auto w-10 h-10 border-4 border-primary-500 border-t-transparent rounded-full animate-spin" />
        <p className="text-slate-300 text-sm">Completing secure sign-in…</p>
      </div>
    </div>
  );
};

export default OAuthCallbackPage;

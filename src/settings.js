const SECOND = 1000;
const MINUTE = 60 * SECOND;

// Sentry configuration
export const SENTRY_PUBLIC_DSN = process.env.REACT_APP_SENTRY_PUBLIC_DSN;

// Normandy API
export const NORMANDY_API_ROOT_URL =
  process.env.REACT_APP_NORMANDY_API_ROOT_URL || 'https://localhost:8000/api/';

// Auth0 / OIDC
export const OIDC_CLIENT_ID =
  process.env.REACT_APP_OIDC_CLIENT_ID || 'hU1YpGcL82wL04vTPsaPAQmkilrSE7wr';
export const OIDC_DOMAIN = process.env.REACT_APP_OIDC_DOMAIN || 'auth.mozilla.auth0.com';
export const OIDC_CALLBACK_URL = process.env.REACT_APP_OIDC_CALLBACK_URL || window.location.origin;
export const OIDC_AUDIENCE =
  process.env.REACT_APP_OIDC_AUDIENCE || `https://${OIDC_DOMAIN}/userinfo`;
export const CHECK_AUTH_EXPIRY_INTERVAL_MS = parseInt(
  process.env.REACT_APP_CHECK_AUTH_EXPIRY_INTERVAL_MS || 5 * MINUTE,
  10,
);

import auth0 from 'auth0-js';

// Default is for minimal-demo-iam.auth0.com
// TODO: We need a better way of configuring these
const OIDC_CLIENT_ID =
  process.env.REACT_APP_OIDC_CLIENT_ID || 'WYRYpJyS5DnDyxLTRVGCQGCWGo2KNQLN';
const OIDC_DOMAIN =
  process.env.REACT_APP_OIDC_DOMAIN || 'minimal-demo-iam.auth0.com';
const OIDC_CALLBACK_URL = window.location.href;
const OIDC_AUDIENCE =
  process.env.REACT_APP_OIDC_AUDIENCE || `https://${OIDC_DOMAIN}/userinfo`;

const webAuth = new auth0.WebAuth({
  domain: OIDC_DOMAIN,
  clientID: OIDC_CLIENT_ID,
  redirectUri: OIDC_CALLBACK_URL,
  audience: OIDC_AUDIENCE,
  responseType: 'token id_token',
  scope: 'openid profile email',
});

export function setSession(authResult) {
  // Set the time that the access token will expire at.
  const expiresAt = JSON.stringify(
    authResult.expiresIn * 1000 + new Date().getTime(),
  );
  localStorage.setItem('session', JSON.stringify(authResult));
  localStorage.setItem('expires_at', expiresAt);
}

export function endSession() {
  // Remove tokens and expiry time from localStorage.
  localStorage.removeItem('session');
  localStorage.removeItem('expires_at');
}

export function isSessionExpired() {
  const expiresAt = JSON.parse(localStorage.getItem('expires_at') || '0');
  return new Date().getTime() >= expiresAt;
}

export function getAuthenticationInfoFromSession() {
  // Check whether the current time is past the access token's expiry time.
  if (isSessionExpired()) {
    return false;
  }
  return JSON.parse(localStorage.getItem('session') || 'false');
}

export function startAuthenticationFlow() {
  webAuth.authorize();
}

export function webAuthHandler(callback, onError, err, authResult) {
  window.location.hash = '';
  if (err) {
    onError(err);
  } else if (authResult && authResult.accessToken && authResult.idToken) {
    setSession(authResult);
    if (callback) {
      callback(authResult);
    }
  }
}

export function finishAuthenticationFlow(onLoggedIn, onLoginFailed) {
  const boundHandler = webAuthHandler.bind(null, onLoggedIn, onLoginFailed);
  try {
    webAuth.parseHash(boundHandler);
  } catch (err) {
    console.error('Login failed', err);
  }
}

export function handleUserInfo(onUserInfo, err, profile) {
  if (err) {
    // TODO: Handle this error better
    throw new Error(err);
  }
  if (onUserInfo) {
    onUserInfo(profile);
  }
}

export function fetchUserInfo(callback) {
  const authInfo = getAuthenticationInfoFromSession();
  if (authInfo && authInfo.accessToken) {
    webAuth.client.userInfo(
      authInfo.accessToken,
      handleUserInfo.bind(null, callback),
    );
  }
}

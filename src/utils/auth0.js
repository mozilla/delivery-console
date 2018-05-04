import auth0 from 'auth0-js';

// Default is for minimal-demo-iam.auth0.com
const OIDC_CLIENT_ID =
  process.env.REACT_APP_OIDC_CLIENT_ID || 'WYRYpJyS5DnDyxLTRVGCQGCWGo2KNQLN';
const OIDC_DOMAIN =
  process.env.REACT_APP_OIDC_DOMAIN || 'minimal-demo-iam.auth0.com';
const OIDC_CALLBACK_URL = window.location.href;

export function webAuthHandler(callback, err, authResult) {
  if (err) {
    throw new Error(err);
  }
  if (authResult && authResult.accessToken && authResult.idToken) {
    window.location.hash = '';
    setSession(authResult);
    if (callback) {
      callback(authResult);
    }
  }
}

export function initWebAuth() {
  const webAuth = new auth0.WebAuth({
    domain: OIDC_DOMAIN,
    clientID: OIDC_CLIENT_ID,
    redirectUri: OIDC_CALLBACK_URL,
    // audience: 'http://minimal-demo-iam.localhost:8000', // 'https://' + OIDC_DOMAIN + '/userinfo',
    audience: 'https://' + OIDC_DOMAIN + '/userinfo', // XXX works??
    responseType: 'token id_token',
    scope: 'openid profile email',
  });
  return webAuth;
}

export function setSession(authResult) {
  // Set the time that the access token will expire at.
  const expiresAt = JSON.stringify(
    authResult.expiresIn * 1000 + new Date().getTime(),
  );
  localStorage.setItem('session', JSON.stringify(authResult));
  localStorage.setItem('expires_at', expiresAt);
}

export function login(initFunc = initWebAuth) {
  const webAuth = initFunc();
  webAuth.authorize();
}

export function logout() {
  // Remove tokens and expiry time from localStorage.
  localStorage.removeItem('session');
  localStorage.removeItem('expires_at');
}

// Check if the user has logged in.
export function checkLogin(
  onLoggedIn,
  initFunc = initWebAuth,
  handler = webAuthHandler,
) {
  try {
    if (!handler) {
      throw new Error('Must provide a hash parser handler');
    }
    const webAuth = initFunc();
    const boundHandler = handler.bind(null, onLoggedIn);
    webAuth.parseHash(boundHandler);
  } catch (err) {
    console.error('Login failed', err);
  }
}

export function isAuthenticated() {
  // Check whether the current time is past the access token's expiry time.
  const session = localStorage.getItem('session');
  if (!session) {
    return false;
  }
  const expiresAt = JSON.parse(localStorage.getItem('expires_at') || '0');
  return (new Date().getTime() < expiresAt && session) || false;
}

export function handleUserInfo(onUserInfo, err, profile) {
  if (err) {
    throw new Error(err);
  }
  if (onUserInfo) {
    onUserInfo(profile);
  }
}

export function fetchUserInfo(callback, initFunc = initWebAuth) {
  const session = localStorage.getItem('session');
  if (!session) {
    return;
  }
  const auth = JSON.parse(session);
  if (!auth.accessToken) {
    return;
  }
  const webAuth = initFunc();
  webAuth.client.userInfo(
    auth.accessToken,
    handleUserInfo.bind(null, callback),
  );
}

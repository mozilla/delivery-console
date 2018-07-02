import auth0 from 'auth0-js';

import { OIDC_DOMAIN, OIDC_CLIENT_ID, OIDC_CALLBACK_URL, OIDC_AUDIENCE } from 'console/settings';

export const webAuth = new auth0.WebAuth({
  domain: OIDC_DOMAIN,
  clientID: OIDC_CLIENT_ID,
  redirectUri: OIDC_CALLBACK_URL,
  audience: OIDC_AUDIENCE,
  responseType: 'token id_token',
  scope: 'openid profile email',
});

export function authorize(returnUrl) {
  return new Promise(resolve => {
    webAuth.authorize({
      state: returnUrl,
    });
    resolve();
  });
}

export function parseHash() {
  return new Promise((resolve, reject) => {
    webAuth.parseHash((err, authResult) => {
      if (err) {
        reject(err);
      }
      resolve(authResult);
    });
  });
}

export function checkSession(returnUrl) {
  return new Promise((resolve, reject) => {
    webAuth.checkSession({ state: returnUrl }, (err, authResult) => {
      if (err) {
        reject(err);
      }
      resolve(authResult);
    });
  });
}

import auth0 from 'auth0-js';

import {
  OIDC_DOMAIN,
  OIDC_CLIENT_ID,
  OIDC_CALLBACK_URL,
  OIDC_AUDIENCE,
} from 'console/settings';

export const webAuth = new auth0.WebAuth({
  domain: OIDC_DOMAIN,
  clientID: OIDC_CLIENT_ID,
  redirectUri: OIDC_CALLBACK_URL,
  audience: OIDC_AUDIENCE,
  responseType: 'token id_token',
  scope: 'openid profile email',
});

export function startAuthenticationFlow(returnUrl) {
  webAuth.authorize({
    state: returnUrl,
  });
}

export function finishAuthenticationFlow() {
  return new Promise((resolve, reject) => {
    webAuth.parseHash((err, authResult) => {
      if (err) {
        reject(err);
      }
      resolve(authResult);
    });
  });
}

export function fetchUserInfo(accessToken) {
  return new Promise((resolve, reject) => {
    webAuth.client.userInfo(accessToken, (err, userInfo) => {
      if (err) {
        reject(new Error(err));
      }
      resolve(userInfo);
    });
  });
}

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

/**
 * A helper function to normalize the shape of the error object returned by Auth0.
 * Ideas borrowed from:
 * https://github.com/auth0/auth0.js/blob/056835b054d6f154611a509f383e1c898e9881e7/src/helper/response-handler.js#L45
 *
 * @param err The error object returned by Auth0
 */
function normalizeErrorObject(err) {
  const errObj = {};
  errObj.code = err.error || err.code || err.error_code || err.status || null;
  errObj.description =
    err.errorDescription ||
    err.error_description ||
    err.description ||
    err.error ||
    err.details ||
    err.err ||
    null;
  return errObj;
}

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
        reject(normalizeErrorObject(err));
      }
      resolve(authResult);
    });
  });
}

export function checkSession(returnUrl) {
  return new Promise((resolve, reject) => {
    webAuth.checkSession({ state: returnUrl }, (err, authResult) => {
      if (err) {
        reject(normalizeErrorObject(err));
      }
      resolve(authResult);
    });
  });
}

import { omit } from 'lodash';

import {
  USER_LOGIN,
  USER_AUTH_FAILURE,
  USER_LOGOUT,
  USER_PROFILE_RECEIVE,
  USER_AUTH_FINISH,
  USER_AUTH_START,
} from 'console/state/action-types';
import { authorize } from 'console/utils/auth0';

export function userProfileReceived(profile) {
  return dispatch =>
    dispatch({
      type: USER_PROFILE_RECEIVE,
      profile,
    });
}

export function authenticationFailed(error) {
  return dispatch =>
    dispatch({
      type: USER_AUTH_FAILURE,
      error,
    });
}

export function logUserIn(authResult) {
  return dispatch => {
    const accessToken = authResult.accessToken;
    const expiresAt = authResult.expiresIn * 1000 + new Date().getTime();

    const cleanAuthResult = omit(authResult, 'state');
    localStorage.setItem('authResult', JSON.stringify(cleanAuthResult));
    localStorage.setItem('expiresAt', JSON.stringify(expiresAt));

    return dispatch({
      type: USER_LOGIN,
      accessToken,
      expiresAt,
    });
  };
}

export function logUserOut() {
  return dispatch => {
    localStorage.removeItem('authResult');
    localStorage.removeItem('expiresAt');

    return dispatch({
      type: USER_LOGOUT,
    });
  };
}

export function startAuthenticationFlow(returnUrl) {
  return dispatch => {
    authorize(returnUrl);

    return dispatch({
      type: USER_AUTH_START,
    });
  };
}

export function finishAuthenticationFlow() {
  return dispatch =>
    dispatch({
      type: USER_AUTH_FINISH,
    });
}

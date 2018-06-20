import { omit } from 'underscore';

import {
  USER_LOGIN,
  USER_LOGIN_FAILURE,
  USER_LOGOUT,
  USER_PROFILE_RECEIVE,
} from 'console/state/action-types';

export function userProfileReceived(profile) {
  return dispatch => {
    dispatch({
      type: USER_PROFILE_RECEIVE,
      profile,
    });
  };
}

export function loginFailed(error) {
  return dispatch =>
    dispatch({
      type: USER_LOGIN_FAILURE,
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

    dispatch({
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

    dispatch({
      type: USER_LOGOUT,
    });
  };
}

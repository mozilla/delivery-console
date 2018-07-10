import { notification } from 'antd';
import omit from 'lodash/omit';

import {
  USER_AUTH_ERROR,
  USER_AUTH_ERROR_NOTIFY,
  USER_AUTH_FINISH,
  USER_AUTH_START,
  USER_LOGIN,
  USER_LOGOUT,
  USER_PROFILE_RECEIVE,
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
      type: USER_AUTH_ERROR,
      error,
    });
}

export function notifyAuthenticationError(error) {
  return dispatch => {
    notification.error({
      message: 'Authentication Error',
      description: `${error.get('code')}: ${error.get('description')}`,
      duration: 0,
    });

    return dispatch({
      type: USER_AUTH_ERROR_NOTIFY,
    });
  };
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

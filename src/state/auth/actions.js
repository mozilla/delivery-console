import {
  USER_INFO_SET,
  USER_LOGIN,
  USER_LOGOUT,
} from 'console/state/action-types';

export function setUserInfo(userInfo) {
  return dispatch =>
    dispatch({
      type: USER_INFO_SET,
      userInfo,
    });
}

export function logUserIn(accessToken) {
  return dispatch =>
    dispatch({
      type: USER_LOGIN,
      accessToken,
    });
}

export function logUserOut() {
  return dispatch =>
    dispatch({
      type: USER_LOGOUT,
    });
}

import {
  USER_LOGIN,
  USER_LOGIN_FAILED,
  USER_LOGOUT,
  USER_SET_INFO,
} from 'console/state/action-types';

export const setLoginFailed = error => {
  return dispatch =>
    dispatch({
      type: USER_LOGIN_FAILED,
      error,
    });
};

export const setUserInfo = userInfo => {
  return dispatch =>
    dispatch({
      type: USER_SET_INFO,
      userInfo,
    });
};

export const userLogin = accessToken => {
  return dispatch =>
    dispatch({
      type: USER_LOGIN,
      accessToken,
    });
};

export const userLogout = () => {
  return dispatch =>
    dispatch({
      type: USER_LOGOUT,
    });
};

export function getUserInfo(state, defaultsTo = null) {
  return state.auth.loginInfo.get('userInfo', defaultsTo);
}

export function getAccessToken(state, defaultsTo = null) {
  return state.auth.loginInfo.get('accessToken', defaultsTo);
}

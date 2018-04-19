import { SET_USER_INFO, USER_LOGIN, USER_LOGOUT } from './action-types';

export const setUserInfo = userInfo => {
  return dispatch =>
    dispatch({
      type: SET_USER_INFO,
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

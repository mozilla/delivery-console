export const SET_USER_INFO = 'SET_USER_INFO';
export const USER_LOGIN = 'USER_LOGIN';
export const USER_LOGOUT = 'USER_LOGOUT';

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

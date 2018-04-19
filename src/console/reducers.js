import { fromJS, Map } from 'immutable';
import { combineReducers } from 'redux';

import { SET_USER_INFO, USER_LOGIN, USER_LOGOUT } from './action-types';

function loginInfo(state = new Map(), action) {
  switch (action.type) {
    case SET_USER_INFO:
      return state.set('userInfo', fromJS(action.userInfo));

    case USER_LOGOUT:
      return state.remove('userInfo').remove('accessToken');

    case USER_LOGIN:
      return state.set('accessToken', fromJS(action.accessToken));

    default:
      return state;
  }
}

export default combineReducers({
  loginInfo,
});

import { fromJS, Map } from 'immutable';
import { combineReducers } from 'redux';

import {
  USER_INFO_SET,
  USER_LOGIN,
  USER_LOGIN_FAILED,
  USER_LOGOUT,
} from 'console/state/action-types';

function loginInfo(state = new Map(), action) {
  switch (action.type) {
    case USER_INFO_SET:
      return state.set('userInfo', fromJS(action.userInfo));

    case USER_LOGIN_FAILED:
      return state.set('error', fromJS(action.error));

    case USER_LOGOUT:
      return state
        .remove('userInfo')
        .remove('accessToken')
        .remove('error');

    case USER_LOGIN:
      return state
        .set('accessToken', fromJS(action.accessToken))
        .remove('error');

    default:
      return state;
  }
}

export default combineReducers({
  loginInfo,
});

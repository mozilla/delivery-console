import { fromJS, Map } from 'immutable';
import { combineReducers } from 'redux-immutable';

import {
  USER_AUTH_ERROR,
  USER_AUTH_ERROR_NOTIFY,
  USER_AUTH_FINISH,
  USER_AUTH_START,
  USER_LOGIN,
  USER_LOGIN_INSECURE,
  USER_LOGOUT,
  USER_PROFILE_RECEIVE,
} from 'console/state/action-types';

function session(state = new Map(), action) {
  switch (action.type) {
    case USER_PROFILE_RECEIVE:
      return state.set('profile', fromJS(action.profile));

    case USER_AUTH_ERROR:
      return state.set('error', fromJS(action.error));

    case USER_AUTH_ERROR_NOTIFY:
      return state.set('error', null);

    case USER_LOGOUT:
      return state
        .remove('profile')
        .remove('accessToken')
        .remove('error')
        .remove('insecure');

    case USER_LOGIN:
      return state
        .set('accessToken', action.accessToken)
        .set('expiresAt', action.expiresAt)
        .remove('error');

    case USER_LOGIN_INSECURE:
      return state
        .set('accessToken', action.email)
        .set('insecure', true)
        .set(
          'profile',
          fromJS({
            nickname: action.email,
            email: action.email,
          }),
        );

    case USER_AUTH_START:
      return state.set('inProgress', true);

    case USER_AUTH_FINISH:
      return state.set('inProgress', false);

    default:
      return state;
  }
}

export default combineReducers({
  session,
});

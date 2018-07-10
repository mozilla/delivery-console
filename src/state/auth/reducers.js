import { fromJS, Map } from 'immutable';
import { combineReducers } from 'redux-immutable';

import {
  USER_LOGIN,
  USER_AUTH_FAILURE,
  USER_LOGOUT,
  USER_PROFILE_RECEIVE,
  USER_AUTH_FINISH,
  USER_AUTH_START,
} from 'console/state/action-types';

function session(state = new Map(), action) {
  switch (action.type) {
    case USER_PROFILE_RECEIVE:
      return state.set('profile', fromJS(action.profile));

    case USER_AUTH_FAILURE:
      return state.set('error', fromJS(action.error));

    case USER_LOGOUT:
      return state
        .remove('profile')
        .remove('accessToken')
        .remove('error');

    case USER_LOGIN:
      return state
        .set('accessToken', action.accessToken)
        .set('expiresAt', action.expiresAt)
        .remove('error');

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

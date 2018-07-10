import { fromJS, Map } from 'immutable';
import { combineReducers } from 'redux-immutable';

import {
  NETWORK_NORMANDY_ADMIN_AVAILABLE,
  REQUEST_FAILURE,
  REQUEST_SEND,
  REQUEST_SUCCESS,
} from 'console/state/action-types';

const defaultState = fromJS({
  availability: {
    normandyAdmin: false,
  },
  requests: {},
});

function requests(state = defaultState.get('requests'), action) {
  switch (action.type) {
    case REQUEST_SEND:
      return state.set(
        action.requestId,
        new Map({
          inProgress: true,
          error: null,
        }),
      );

    case REQUEST_SUCCESS:
      return state.set(
        action.requestId,
        new Map({
          inProgress: false,
          error: null,
        }),
      );

    case REQUEST_FAILURE:
      return state.set(
        action.requestId,
        new Map({
          inProgress: false,
          error: fromJS(action.error),
        }),
      );

    default:
      return state;
  }
}

function availability(state = defaultState.get('availability'), action) {
  switch (action.type) {
    case NETWORK_NORMANDY_ADMIN_AVAILABLE:
      return state.set('normandyAdmin', action.available);

    default:
      return state;
  }
}

export default combineReducers({
  requests,
  availability,
});

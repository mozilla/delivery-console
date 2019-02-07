import { fromJS, Map } from 'immutable';
import { combineReducers } from 'redux-immutable';

import { ACTIONS_RECEIVE, ACTION_RECEIVE } from 'console/state/action-types';

function items(state = new Map(), action) {
  switch (action.type) {
    case ACTION_RECEIVE:
      return state.set(action.action.id, fromJS(action.action));

    case ACTIONS_RECEIVE:
      action.actions.forEach(action => {
        state = state.set(action.id, fromJS(action));
      });
      return state;

    default:
      return state;
  }
}

export default combineReducers({
  items,
});

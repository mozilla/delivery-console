import { fromJS, Map } from 'immutable';
import { combineReducers } from 'redux-immutable';

import {
  RECIPE_HISTORY_RECEIVE,
  RECIPE_PAGE_RECEIVE,
  USER_RECEIVE,
} from 'console/state/action-types';

function items(state = new Map(), action) {
  switch (action.type) {
    case USER_RECEIVE: {
      return state.set(action.user.id, fromJS(action.user));
    }

    case RECIPE_HISTORY_RECEIVE: {
      const revisions = fromJS(action.revisions);

      return state.withMutations(mutableState => {
        revisions.forEach(revision => {
          const creator = revision.getIn(['approval_request', 'creator']);
          if (creator) {
            mutableState.set(creator.get('id'), creator);
          }

          const approver = revision.getIn(['approval_request', 'approver']);
          if (approver) {
            mutableState.set(approver.get('id'), approver);
          }
        });
      });
    }

    case RECIPE_PAGE_RECEIVE: {
      const recipes = fromJS(action.recipes.results);

      return state.withMutations(mutableState => {
        recipes.forEach(recipe => {
          const creator = recipe.getIn(['approved_revision', 'approval_request', 'creator']);
          if (creator) {
            mutableState.set(creator.get('id'), creator);
          }

          const approver = recipe.getIn(['approved_revision', 'approval_request', 'approver']);
          if (approver) {
            mutableState.set(approver.get('id'), approver);
          }
        });
      });
    }

    default: {
      return state;
    }
  }
}

export default combineReducers({
  items,
});

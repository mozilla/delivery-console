import { fromJS, Map } from 'immutable';
import { combineReducers } from 'redux-immutable';

import {
  APPROVAL_REQUEST_CREATE,
  APPROVAL_REQUEST_DELETE,
  RECIPE_DELETE,
  RECIPE_HISTORY_RECEIVE,
  RECIPE_PAGE_RECEIVE,
  REVISION_RECEIVE,
} from 'console/state/action-types';

const formatRevision = revision =>
  revision.withMutations(mutRevision =>
    mutRevision
      .set('action_id', mutRevision.getIn(['action', 'id'], null))
      .removeIn(['recipe', 'action'])
      .set('approval_request_id', mutRevision.getIn(['approval_request', 'id'], null))
      .remove('approval_request')
      .set('user_id', mutRevision.getIn(['user', 'id'], null))
      .remove('user'),
  );

function items(state = new Map(), action) {
  switch (action.type) {
    case RECIPE_HISTORY_RECEIVE: {
      const revisions = fromJS(action.revisions);

      return state.withMutations(mutState => {
        revisions.forEach(revision => {
          mutState.set(revision.get('id'), formatRevision(revision));
        });
      });
    }

    case REVISION_RECEIVE: {
      let revision = fromJS(action.revision);
      revision = formatRevision(revision);

      return state.set(action.revision.id, revision);
    }

    case RECIPE_PAGE_RECEIVE: {
      const recipes = fromJS(action.recipes.results);

      return state.withMutations(mutState => {
        recipes.forEach(receivedRecipe => {
          mutState.set(
            receivedRecipe.getIn(['latest_revision', 'id']),
            formatRevision(receivedRecipe.get('latest_revision')),
          );

          if (receivedRecipe.get('approved_revision')) {
            mutState.set(
              receivedRecipe.getIn(['approved_revision', 'id']),
              formatRevision(receivedRecipe.get('approved_revision')),
            );
          }
        });
      });
    }

    case RECIPE_DELETE:
      return state.filterNot(item => item.getIn(['recipe', 'id']) === action.recipeId);

    case APPROVAL_REQUEST_CREATE:
      return state.update(action.revisionId, item =>
        item.set('approval_request_id', action.approvalRequest.id),
      );

    case APPROVAL_REQUEST_DELETE:
      return state.map(item => {
        if (item.get('approval_request_id') === action.approvalRequestId) {
          return item.set('approval_request_id', null);
        }
        return item;
      });

    default:
      return state;
  }
}

export default combineReducers({
  items,
});

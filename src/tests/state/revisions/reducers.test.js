import { fromJS } from 'immutable';

import { RECIPE_DELETE, REVISION_RECEIVE } from 'console/state/action-types';
import revisionsReducer from 'console/state/revisions/reducers';

import { INITIAL_STATE, RevisionFactory } from '.';

describe('Revisions reducer', () => {
  const revision = RevisionFactory.build();

  it('should return initial state by default', () => {
    expect(revisionsReducer(undefined, { type: 'INITIAL' })).toEqual(INITIAL_STATE);
  });

  it('should handle REVISION_RECEIVE', () => {
    const reducedRevision = {
      ...revision,
      recipe: {
        ...revision.recipe,
        action_id: revision.recipe.action.id,
      },
      approval_request_id: null,
      user_id: revision.user.id,
    };

    delete reducedRevision.recipe.action;
    delete reducedRevision.approval_request;
    delete reducedRevision.user;

    const updatedState = revisionsReducer(undefined, {
      type: REVISION_RECEIVE,
      revision,
    });

    expect(updatedState).toEqualImmutable(
      INITIAL_STATE.setIn(['items', revision.id], fromJS(reducedRevision)),
    );
  });

  it('should handle RECIPE_DELETE', () => {
    const state = revisionsReducer(undefined, {
      type: REVISION_RECEIVE,
      revision,
    });

    const updatedState = revisionsReducer(state, {
      type: RECIPE_DELETE,
      recipeId: revision.recipe.id,
    });

    expect(updatedState).toEqual(INITIAL_STATE);
  });
});

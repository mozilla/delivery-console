import { fromJS } from 'immutable';

import { RECIPE_DELETE, RECIPE_PAGE_RECEIVE, REVISION_RECEIVE } from 'console/state/action-types';
import revisionsReducer from 'console/state/revisions/reducers';

import { RecipeFactory } from 'console/tests/state/recipes';
import { INITIAL_STATE, RevisionFactory } from 'console/tests/state/revisions';

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
      },
      action_id: revision.action.id,
      approval_request_id: null,
      user_id: revision.user.id,
    };

    delete reducedRevision.action;
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

  it('should handle RECIPE_PAGE_RECEIVE', () => {
    const recipe = RecipeFactory.build();

    const reducedRevision = {
      ...recipe.latest_revision,
      recipe: {
        ...recipe.latest_revision.recipe,
      },
      action_id: recipe.latest_revision.action.id,
      approval_request_id: null,
      user_id: recipe.latest_revision.user.id,
    };

    delete reducedRevision.action;
    delete reducedRevision.approval_request;
    delete reducedRevision.user;

    const updatedState = revisionsReducer(undefined, {
      type: RECIPE_PAGE_RECEIVE,
      pageNumber: 1,
      recipes: {
        count: 1,
        next: null,
        previous: null,
        results: [{ ...recipe }],
      },
    });

    expect(updatedState).toEqualImmutable(
      INITIAL_STATE.setIn(['items', recipe.latest_revision.id], fromJS(reducedRevision)),
    );
  });
});

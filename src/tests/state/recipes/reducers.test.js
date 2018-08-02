import { fromJS, List } from 'immutable';

import {
  RECIPE_DELETE,
  RECIPE_RECEIVE,
  RECIPE_FILTERS_RECEIVE,
  RECIPE_HISTORY_RECEIVE,
} from 'console/state/action-types';
import recipesReducer from 'console/state/recipes/reducers';
import { FILTERS, INITIAL_STATE, RecipeFactory } from 'console/tests/state/recipes';

describe('Recipes reducer', () => {
  const recipe = RecipeFactory.build();

  it('should return initial state by default', () => {
    expect(recipesReducer(undefined, { type: 'INITIAL' })).toEqual(INITIAL_STATE);
  });

  it('should handle RECIPE_RECEIVE', () => {
    const reducedRecipe = {
      ...recipe,
      action_id: recipe.action.id,
      latest_revision_id: recipe.latest_revision.id,
      approved_revision_id: recipe.approved_revision ? recipe.approved_revision.id : null,
    };

    delete reducedRecipe.action;
    delete reducedRecipe.latest_revision;
    delete reducedRecipe.approved_revision;

    const updatedState = recipesReducer(undefined, {
      type: RECIPE_RECEIVE,
      recipe,
    });

    expect(updatedState).toEqualImmutable(
      INITIAL_STATE.setIn(['items', recipe.id], fromJS(reducedRecipe)),
    );
  });

  it('should handle RECIPE_DELETE', () => {
    const state = recipesReducer(undefined, {
      type: RECIPE_RECEIVE,
      recipe,
    });

    const updateState = recipesReducer(state, {
      type: RECIPE_DELETE,
      recipeId: recipe.id,
    });

    expect(updateState).toEqual(INITIAL_STATE);
  });

  it('should handle RECIPE_FILTERS_RECEIVE', () => {
    const updatedState = recipesReducer(undefined, {
      type: RECIPE_FILTERS_RECEIVE,
      filters: FILTERS,
    });
    expect(updatedState).toEqual(
      INITIAL_STATE.set('filters', INITIAL_STATE.get('filters').merge(fromJS(FILTERS))),
    );
  });

  it('should handle RECIPE_HISTORY_RECEIVE', () => {
    const updatedState = recipesReducer(undefined, {
      type: RECIPE_HISTORY_RECEIVE,
      recipeId: recipe.id,
      revisions: [recipe.latest_revision],
    });
    expect(updatedState).toEqual(
      INITIAL_STATE.setIn(['history', recipe.id], new List([recipe.latest_revision.id])),
    );
  });
});

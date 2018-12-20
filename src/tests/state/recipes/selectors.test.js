import { fromJS } from 'immutable';

import {
  ACTION_RECEIVE,
  RECIPE_RECEIVE,
  REVISION_RECEIVE,
  USER_RECEIVE,
} from 'console/state/action-types';
import actionsReducer from 'console/state/actions/reducers';
import recipesReducer from 'console/state/recipes/reducers';
import revisionsReducer from 'console/state/revisions/reducers';
import usersReducer from 'console/state/users/reducers';
import { getRecipe, getRecipeFilters, getRecipeHistory } from 'console/state/recipes/selectors';
import { INITIAL_STATE } from 'console/tests/state';
import { FILTERS, RecipeFactory } from 'console/tests/state/recipes';

describe('getRecipe', () => {
  const recipe = RecipeFactory.build();

  const STATE = INITIAL_STATE.merge(
    fromJS({
      actions: actionsReducer(undefined, {
        type: ACTION_RECEIVE,
        action: recipe.latest_revision.action,
      }),
      recipes: recipesReducer(undefined, {
        type: RECIPE_RECEIVE,
        recipe,
      }),
      revisions: revisionsReducer(undefined, {
        type: REVISION_RECEIVE,
        revision: recipe.latest_revision,
      }),
      users: usersReducer(undefined, {
        type: USER_RECEIVE,
        user: recipe.latest_revision.user,
      }),
    }),
  );

  it('should return the recipe', () => {
    expect(getRecipe(STATE, recipe.id)).toEqualImmutable(fromJS(recipe));
  });

  it('should return `null` for invalid ID', () => {
    expect(getRecipe(STATE, 'invalid')).toEqual(null);
  });

  it('should return default value for invalid ID with default provided', () => {
    expect(getRecipe(STATE, 'invalid', 'default')).toEqual('default');
  });
});

describe('getRecipeFilters', () => {
  const STATE = INITIAL_STATE.setIn(['recipes', 'filters'], fromJS(FILTERS));

  it('should return the list of filters', () => {
    expect(getRecipeFilters(STATE)).toEqualImmutable(fromJS(FILTERS));
  });
});

describe('getRecipeHistory', () => {
  const recipe = RecipeFactory.build();

  const STATE = INITIAL_STATE.merge(
    fromJS({
      actions: actionsReducer(undefined, {
        type: ACTION_RECEIVE,
        action: recipe.latest_revision.action,
      }),
      revisions: revisionsReducer(undefined, {
        type: REVISION_RECEIVE,
        revision: recipe.latest_revision,
      }),
      users: usersReducer(undefined, {
        type: USER_RECEIVE,
        user: recipe.latest_revision.user,
      }),
    }),
  ).setIn(['recipes', 'history', recipe.id], fromJS([recipe.latest_revision.id]));

  it('should return the list of revisions', () => {
    expect(getRecipeHistory(STATE, recipe.id)).toEqualImmutable(fromJS([recipe.latest_revision]));
  });
});

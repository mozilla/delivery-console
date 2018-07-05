import { fromJS } from 'immutable';
import * as matchers from 'jest-immutable-matchers';

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

  const STATE = INITIAL_STATE.set(
    'actions',
    actionsReducer(undefined, {
      type: ACTION_RECEIVE,
      action: recipe.action,
    }),
  )
    .set(
      'recipes',
      recipesReducer(undefined, {
        type: RECIPE_RECEIVE,
        recipe,
      }),
    )
    .set(
      'revisions',
      revisionsReducer(undefined, {
        type: REVISION_RECEIVE,
        revision: recipe.latest_revision,
      }),
    )
    .set(
      'users',
      usersReducer(undefined, {
        type: USER_RECEIVE,
        user: recipe.latest_revision.user,
      }),
    );

  beforeEach(() => {
    jest.addMatchers(matchers);
  });

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

  beforeEach(() => {
    jest.addMatchers(matchers);
  });

  it('should return the list of filters', () => {
    expect(getRecipeFilters(STATE)).toEqualImmutable(fromJS(FILTERS));
  });
});

describe('getRecipeHistory', () => {
  const recipe = RecipeFactory.build();

  const STATE = INITIAL_STATE.set(
    'actions',
    actionsReducer(undefined, {
      type: ACTION_RECEIVE,
      action: recipe.action,
    }),
  )
    .setIn(['recipes', 'history', recipe.id], fromJS([recipe.latest_revision.id]))
    .set(
      'revisions',
      revisionsReducer(undefined, {
        type: REVISION_RECEIVE,
        revision: recipe.latest_revision,
      }),
    )
    .set(
      'users',
      usersReducer(undefined, {
        type: USER_RECEIVE,
        user: recipe.latest_revision.user,
      }),
    );

  beforeEach(() => {
    jest.addMatchers(matchers);
  });

  it('should return the list of revisions', () => {
    expect(getRecipeHistory(STATE, recipe.id)).toEqualImmutable(fromJS([recipe.latest_revision]));
  });
});

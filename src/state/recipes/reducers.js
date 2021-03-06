import { fromJS, Map } from 'immutable';
import { combineReducers } from 'redux-immutable';

import {
  EXPERIMENT_RECIPE_DATA_RECEIVE,
  RECIPE_DELETE,
  RECIPE_LISTING_COLUMNS_CHANGE,
  RECIPE_PAGE_RECEIVE,
  RECIPE_RECEIVE,
  RECIPE_FILTERS_RECEIVE,
  RECIPE_HISTORY_RECEIVE,
} from 'console/state/action-types';
import { RECIPE_LISTING_COLUMNS } from 'console/state/constants';

function filters(state = new Map(), action) {
  switch (action.type) {
    case RECIPE_FILTERS_RECEIVE:
      return fromJS(action.filters);

    default:
      return state;
  }
}

function history(state = new Map(), action) {
  switch (action.type) {
    case RECIPE_HISTORY_RECEIVE:
      return state.set(action.recipeId, fromJS(action.revisions.map(revision => revision.id)));

    case RECIPE_DELETE:
      return state.remove(action.recipeId);

    default:
      return state;
  }
}

const formatRecipe = recipe =>
  recipe.withMutations(mutRecipe =>
    mutRecipe
      .set('latest_revision_id', mutRecipe.getIn(['latest_revision', 'id'], null))
      .set('approved_revision_id', mutRecipe.getIn(['approved_revision', 'id'], null))
      .remove('latest_revision')
      .remove('approved_revision'),
  );

function items(state = new Map(), action) {
  switch (action.type) {
    case RECIPE_RECEIVE: {
      const recipe = fromJS(action.recipe);
      return state.set(action.recipe.id, formatRecipe(recipe));
    }

    case RECIPE_PAGE_RECEIVE: {
      const recipes = fromJS(action.recipes.results);

      return state.withMutations(mutState => {
        recipes.forEach(receivedRecipe => {
          mutState.set(receivedRecipe.get('id'), formatRecipe(receivedRecipe));
        });
      });
    }

    case RECIPE_DELETE:
      return state.remove(action.recipeId);

    default:
      return state;
  }
}

function listing(state = new Map(), action) {
  switch (action.type) {
    case RECIPE_PAGE_RECEIVE:
      return state
        .set('count', action.recipes.count)
        .set('pageNumber', action.pageNumber)
        .set('results', fromJS(action.recipes.results.map(result => result.id)));

    case RECIPE_LISTING_COLUMNS_CHANGE:
      return state.set(
        'columns',
        RECIPE_LISTING_COLUMNS.filter(column => action.columns.includes(column)),
      );

    default:
      return state;
  }
}

function experiments(state = new Map(), action) {
  switch (action.type) {
    case EXPERIMENT_RECIPE_DATA_RECEIVE:
      return state.set(action.slug, fromJS(action.data));

    default:
      return state;
  }
}

export default combineReducers({
  experiments,
  filters,
  history,
  items,
  listing,
});

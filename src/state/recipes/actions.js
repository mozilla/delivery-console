import {
  EXPERIMENT_RECIPE_DATA_RECEIVE,
  RECIPE_DELETE,
  RECIPE_LISTING_COLUMNS_CHANGE,
  RECIPE_PAGE_RECEIVE,
  RECIPE_RECEIVE,
  RECIPE_FILTERS_RECEIVE,
  RECIPE_HISTORY_RECEIVE,
} from 'console/state/action-types';
import {
  makeApiRequest,
  makeNormandyApiRequest,
  makeRequest,
} from 'console/state/network/actions';
import { revisionReceived } from 'console/state/revisions/actions';
import { EXPERIMENTER_API_ROOT_URL } from 'console/settings';

export function recipeReceived(recipe) {
  return dispatch => {
    dispatch({
      type: RECIPE_RECEIVE,
      recipe,
    });

    dispatch(revisionReceived(recipe.latest_revision));

    if (recipe.approved_revision && recipe.approved_revision.id !== recipe.latest_revision.id) {
      dispatch(revisionReceived(recipe.approved_revision));
    }
  };
}

export function fetchRecipe(pk) {
  return async dispatch => {
    const requestId = `fetch-recipe-${pk}`;
    const recipe = await dispatch(makeNormandyApiRequest(requestId, `v3/recipe/${pk}/`));
    dispatch(recipeReceived(recipe));
  };
}

export function fetchFilteredRecipesPage(pageNumber = 1, filters = {}) {
  return async dispatch => {
    const filterIds = Object.keys(filters).map(key => `${key}-${filters[key]}`);
    const requestId = `fetch-filtered-recipes-page-${pageNumber}-${filterIds.join('-')}`;

    const options = {
      data: { ...filters },
    };
    if (pageNumber !== Infinity) {
      options.data.page = pageNumber;
    }
    const recipes = await dispatch(makeNormandyApiRequest(requestId, 'v3/recipe/', options));
    while (pageNumber === Infinity && recipes.next) {
      const nextRecipes = await dispatch(makeApiRequest(requestId, recipes.next));
      recipes.next = nextRecipes.next;
      recipes.results.push(...nextRecipes.results);
    }

    dispatch({
      type: RECIPE_PAGE_RECEIVE,
      pageNumber,
      recipes,
    });
  };
}

export function createRecipe(recipeData) {
  return async dispatch => {
    const requestId = 'create-recipe';
    const recipe = await dispatch(
      makeNormandyApiRequest(requestId, 'v3/recipe/', {
        method: 'POST',
        data: recipeData,
      }),
    );
    dispatch(recipeReceived(recipe));

    return recipe.id;
  };
}

export function updateRecipe(pk, recipeData) {
  return async dispatch => {
    const requestId = `update-recipe-${pk}`;
    const recipe = await dispatch(
      makeNormandyApiRequest(requestId, `v3/recipe/${pk}/`, {
        method: 'PATCH',
        data: recipeData,
      }),
    );
    dispatch(recipeReceived(recipe));
  };
}

export function deleteRecipe(pk) {
  return async dispatch => {
    const requestId = `delete-recipe-${pk}`;

    await dispatch(
      makeNormandyApiRequest(requestId, `v3/recipe/${pk}/`, {
        method: 'DELETE',
      }),
    );

    dispatch({
      type: RECIPE_DELETE,
      recipeId: pk,
    });
  };
}

export function enableRecipe(pk) {
  return async dispatch => {
    const requestId = `enable-recipe-${pk}`;
    const recipe = await dispatch(
      makeNormandyApiRequest(requestId, `v3/recipe/${pk}/enable/`, {
        method: 'POST',
      }),
    );
    dispatch(recipeReceived(recipe));
  };
}

export function disableRecipe(pk) {
  return async dispatch => {
    const requestId = `disable-recipe-${pk}`;
    const recipe = await dispatch(
      makeNormandyApiRequest(requestId, `v3/recipe/${pk}/disable/`, {
        method: 'POST',
      }),
    );
    dispatch(recipeReceived(recipe));
  };
}

export function fetchRecipeHistory(pk) {
  return async dispatch => {
    const requestId = `fetch-recipe-history-${pk}`;
    const revisions = await dispatch(
      makeNormandyApiRequest(requestId, `v3/recipe/${pk}/history/`),
    );

    dispatch({
      type: RECIPE_HISTORY_RECEIVE,
      recipeId: pk,
      revisions,
    });
  };
}

export function fetchRecipeFilters() {
  return async dispatch => {
    const localStorageKey = 'recipe_filters';
    const localFilters = window.localStorage.getItem(localStorageKey);
    if (localFilters) {
      // If the filters *were* in localStorage, it's a JSON *string*.
      dispatch({
        type: RECIPE_FILTERS_RECEIVE,
        filters: JSON.parse(localFilters),
      });
    }

    const options = {};
    // If we already had the filters in localStorage, we can make a "stealth API request"
    // which is the same as a regular request except it doesn't update the global state
    // that there's a request we're waiting for.
    if (localFilters) {
      options.stealth = true;
    }
    const requestId = 'fetch-recipe-filters';
    const filters = await dispatch(makeNormandyApiRequest(requestId, 'v3/filters/', options));
    // After it has been retrieved remotely, it's very possible that the lists
    // haven't changed. If it hasn't changed compared to what we had in local Storage, then
    // don't bother dispatching again.
    if (!localFilters || JSON.stringify(filters) !== localFilters) {
      dispatch({
        type: RECIPE_FILTERS_RECEIVE,
        filters,
      });
      window.localStorage.setItem(localStorageKey, JSON.stringify(filters));
    }
  };
}

export function loadRecipeListingColumns() {
  return async dispatch => {
    const columns = window.localStorage.getItem('recipe_listing_columns');

    if (columns) {
      dispatch({
        type: RECIPE_LISTING_COLUMNS_CHANGE,
        columns,
      });
    }
  };
}

export function saveRecipeListingColumns(columns) {
  return dispatch => {
    window.localStorage.setItem('recipe_listing_columns', columns);

    dispatch({
      type: RECIPE_LISTING_COLUMNS_CHANGE,
      columns,
    });
  };
}

export function fetchExperimentRecipeData(slug) {
  return async dispatch => {
    const requestId = `fetch-experiment-recipe-data-${slug}`;
    const data = await dispatch(
      makeRequest(requestId, `${EXPERIMENTER_API_ROOT_URL}v1/experiments/${slug}/recipe/`),
    );
    dispatch({
      type: EXPERIMENT_RECIPE_DATA_RECEIVE,
      slug,
      data,
    });
  };
}

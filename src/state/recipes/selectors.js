import { List, Map } from 'immutable';

import { getActionByName } from 'console/state/actions/selectors';
import { DEFAULT_RECIPE_LISTING_COLUMNS } from 'console/state/constants';
import { getRevision } from 'console/state/revisions/selectors';

export function getRecipe(state, id, defaultsTo = null) {
  const recipe = state.getIn(['recipes', 'items', id]);

  if (recipe) {
    const latestRevision = getRevision(state, recipe.get('latest_revision_id'));
    const approvedRevision = getRevision(state, recipe.get('approved_revision_id'));

    return recipe
      .set('latest_revision', latestRevision)
      .set('approved_revision', approvedRevision)
      .remove('latest_revision_id')
      .remove('approved_revision_id');
  }

  return defaultsTo;
}

export function getRecipeListingCount(state) {
  return state.getIn(['recipes', 'listing', 'count']);
}

export function getRecipeListingAsRevisions(state) {
  const recipes = state.getIn(['recipes', 'listing', 'results'], new List());
  return recipes.map(id => getCurrentRevisionForRecipe(state, id));
}

export function getRecipeListingAsRevisionsFlattenedAction(state) {
  const recipes = getRecipeListingAsRevisions(state);
  return recipes.map(item => {
    item = item || Map(); // The fallback is to handle inconsistencies noticed at initialization
    return item.set('action', item.getIn(['action', 'name']));
  });
}

export function getRecipeListingPageNumber(state) {
  return state.getIn(['recipes', 'listing', 'pageNumber']);
}

export function getRecipeListingColumns(state, defaultsTo = DEFAULT_RECIPE_LISTING_COLUMNS) {
  return state.getIn(['recipes', 'listing', 'columns'], defaultsTo);
}

export function getRecipeHistory(state, id) {
  const history = state.getIn(['recipes', 'history', id], new List());
  return history.map(revisionId => getRevision(state, revisionId));
}

export function getRecipeFilters(state) {
  return state.getIn(['recipes', 'filters']);
}

export function getLatestRevisionForRecipe(state, id, defaultsTo = null) {
  const recipe = getRecipe(state, id, new Map());
  return recipe.get('latest_revision') || defaultsTo;
}

export function getLatestRevisionIdForRecipe(state, id, defaultsTo = null) {
  return state.getIn(['recipes', 'items', id, 'latest_revision_id']) || defaultsTo;
}

export function getApprovedRevisionForRecipe(state, id, defaultsTo = null) {
  const recipe = getRecipe(state, id, new Map());
  return recipe.get('approved_revision') || defaultsTo;
}

export function getApprovedRevisionIdForRecipe(state, id, defaultsTo = null) {
  return state.getIn(['recipes', 'items', id, 'approved_revision_id']) || defaultsTo;
}

export function getCurrentRevisionForRecipe(state, id, defaultTo = null) {
  let revision = getApprovedRevisionForRecipe(state, id);
  if (!revision) {
    revision = getLatestRevisionForRecipe(state, id);
  }
  return revision || defaultTo;
}

export function getCurrentRevisionIdForRecipe(state, id, defaultsTo = null) {
  return getCurrentRevisionForRecipe(state, id, new Map()).get('id', defaultsTo);
}

export function getRecipeApprovalHistory(state, id) {
  const history = getRecipeHistory(state, id);
  return history.filter(revision => revision.get('approval_request'));
}

export function getExperimentRecipeData(state, slug) {
  const data = state.getIn(['recipes', 'experiments', slug]);

  if (data) {
    const action = getActionByName(state, data.get('action_name'));
    return data.set('action', action).remove('action_name');
  }
}

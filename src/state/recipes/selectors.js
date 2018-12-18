import { List, Map } from 'immutable';

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

export function getRecipeListing(state) {
  const recipes = state.getIn(['recipes', 'listing', 'results'], new List());
  return recipes.map(id => getCurrentRevisionForRecipe(state, id));
}

export function getRecipeListingFlattenedAction(state) {
  const recipes = getRecipeListing(state);
  return recipes.map(item => {
    item = item || Map();
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

export function isRecipeEnabled(state, id, defaultsTo = false) {
  const recipe = getRecipe(state, id, new Map());
  return recipe.get('enabled', defaultsTo);
}

export function getLatestRevisionForRecipe(state, id, defaultsTo = null) {
  const recipe = getRecipe(state, id, new Map());
  return recipe.get('latest_revision', defaultsTo);
}

export function getLatestRevisionIdForRecipe(state, id, defaultsTo = null) {
  return state.getIn(['recipes', 'items', id, 'latest_revision_id']) || defaultsTo;
}

export function getApprovedRevisionForRecipe(state, id, defaultsTo = null) {
  const recipe = getRecipe(state, id, new Map());
  return recipe.get('approved_revision', defaultsTo);
}

export function getApprovedRevisionIdForRecipe(state, id, defaultsTo = null) {
  return state.getIn(['recipes', 'items', id, 'approved_revision_id']) || defaultsTo;
}

export function getCurrentRevisionForRecipe(state, id, defaultsTo = null) {
  let revision = getApprovedRevisionForRecipe(state, id);
  if (!revision) {
    revision = getLatestRevisionForRecipe(state, id);
  }
  return revision || defaultsTo;
}

export function getCurrentRevisionIdForRecipe(state, id, defaultsTo = null) {
  let revisionId = getApprovedRevisionIdForRecipe(state, id);
  if (!revisionId) {
    revisionId = getLatestRevisionIdForRecipe(state, id);
  }
  return revisionId || defaultsTo;
}

export function getRecipeApprovalHistory(state, id) {
  const history = getRecipeHistory(state, id);
  return history.filter(revision => revision.get('approval_request'));
}

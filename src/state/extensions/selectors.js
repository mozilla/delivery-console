import { List } from 'immutable';

import { DEFAULT_EXTENSION_LISTING_COLUMNS } from 'console/state/constants';

export function getExtension(state, id, defaultsTo = null) {
  return state.getIn(['extensions', 'items', id], defaultsTo);
}

export function getExtensionListingCount(state) {
  return state.getIn(['extensions', 'listing', 'count']);
}

export function getExtensionListing(state) {
  const extensions = state.getIn(['extensions', 'listing', 'results'], new List());
  return extensions.map(id => getExtension(state, id));
}

export function getExtensionListingPageNumber(state) {
  return state.getIn(['extensions', 'listing', 'pageNumber']);
}

export function getExtensionListingColumns(state, defaultsTo = DEFAULT_EXTENSION_LISTING_COLUMNS) {
  return state.getIn(['extensions', 'listing', 'columns'], defaultsTo);
}

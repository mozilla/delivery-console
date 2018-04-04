import { List } from 'immutable';

import { DEFAULT_EXTENSION_LISTING_COLUMNS } from 'normandy/state/constants';

export function getExtension(state, id, defaultsTo = null) {
  return state.extensions.items.get(id, defaultsTo);
}

export function getExtensionListingCount(state) {
  return state.extensions.listing.get('count');
}

export function getExtensionListing(state) {
  const extensions = state.extensions.listing.get('results', new List([]));
  return extensions.map(id => getExtension(state, id));
}

export function getExtensionListingPageNumber(state) {
  return state.extensions.listing.get('pageNumber');
}

export function getExtensionListingColumns(
  state,
  defaultsTo = DEFAULT_EXTENSION_LISTING_COLUMNS,
) {
  return state.extensions.listing.get('columns', defaultsTo);
}

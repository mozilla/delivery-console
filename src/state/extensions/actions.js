import {
  EXTENSION_LISTING_COLUMNS_CHANGE,
  EXTENSION_PAGE_RECEIVE,
  EXTENSION_RECEIVE,
} from 'console/state/action-types';
import {
  makeNormandyApiRequest,
  makeNormandyReadonlyApiRequest,
} from 'console/state/network/actions';
import { isNormandyAdminAvailable } from 'console/state/network/selectors';

export function fetchExtension(pk) {
  return async (dispatch, getState) => {
    const state = getState();
    const fetcher = isNormandyAdminAvailable(state)
      ? makeNormandyApiRequest
      : makeNormandyReadonlyApiRequest;
    const requestId = `fetch-extension-${pk}`;
    const extension = await dispatch(fetcher(requestId, `v3/extension/${pk}/`));

    dispatch({
      type: EXTENSION_RECEIVE,
      extension,
    });
  };
}

export function fetchExtensionsPage(pageNumber = 1, filters = {}) {
  return async (dispatch, getState) => {
    const state = getState();
    const fetcher = isNormandyAdminAvailable(state)
      ? makeNormandyApiRequest
      : makeNormandyReadonlyApiRequest;
    const requestId = `fetch-extensions-page-${pageNumber}`;
    const extensions = await dispatch(
      fetcher(requestId, 'v3/extension/', {
        data: {
          page: pageNumber,
          ...filters,
        },
      }),
    );

    extensions.results.forEach(extension => {
      dispatch({
        type: EXTENSION_RECEIVE,
        extension,
      });
    });

    dispatch({
      type: EXTENSION_PAGE_RECEIVE,
      pageNumber,
      extensions,
      isLastPage: extensions.results.next === null,
    });
  };
}

function prepareExtensionFormData(extensionData) {
  const data = new FormData();

  Object.keys(extensionData).forEach(key => {
    data.append(key, extensionData[key]);
  });

  return data;
}

export function createExtension(extensionData) {
  return async dispatch => {
    const requestId = 'create-extension';
    const extension = await dispatch(
      makeNormandyApiRequest(requestId, 'v3/extension/', {
        method: 'POST',
        body: prepareExtensionFormData(extensionData),
      }),
    );
    dispatch({
      type: EXTENSION_RECEIVE,
      extension,
    });
    return extension.id;
  };
}

export function updateExtension(pk, extensionData) {
  return async dispatch => {
    const requestId = `update-extension-${pk}`;
    const extension = await dispatch(
      makeNormandyApiRequest(requestId, `v3/extension/${pk}/`, {
        method: 'PATCH',
        body: prepareExtensionFormData(extensionData),
      }),
    );
    dispatch({
      type: EXTENSION_RECEIVE,
      extension,
    });
  };
}

export function loadExtensionListingColumns() {
  return async dispatch => {
    const columns = window.localStorage.getItem('extension_listing_columns');

    if (columns) {
      dispatch({
        type: EXTENSION_LISTING_COLUMNS_CHANGE,
        columns,
      });
    }
  };
}

export function saveExtensionListingColumns(columns) {
  return dispatch => {
    window.localStorage.setItem('extension_listing_columns', columns);

    dispatch({
      type: EXTENSION_LISTING_COLUMNS_CHANGE,
      columns,
    });
  };
}

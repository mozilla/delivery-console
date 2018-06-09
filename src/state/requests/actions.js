/* eslint import/prefer-default-export: "off" */

import { NORMANDY_API_ROOT_URL } from 'console/settings';
import { getAccessToken } from 'console/state/auth/selectors';
import { getRequest } from 'console/state/requests/selectors';

import { REQUEST_FAILURE, REQUEST_SEND, REQUEST_SUCCESS } from 'console/state/action-types';

import APIClient from 'console/utils/api';

export function makeApiRequest(requestId, root, endpoint, options = {}) {
  return async (dispatch, getState) => {
    const state = getState();
    const accessToken = getAccessToken(state);
    const api = new APIClient(root, accessToken);
    const request = getRequest(state, requestId);

    if (request.inProgress) {
      return true;
    }

    dispatch({
      type: REQUEST_SEND,
      requestId,
    });

    let data;

    try {
      data = await api.fetch(endpoint, options);
    } catch (error) {
      dispatch({
        type: REQUEST_FAILURE,
        requestId,
        error,
      });

      throw error;
    }

    dispatch({
      type: REQUEST_SUCCESS,
      requestId,
    });

    return data;
  };
}

export function makeNormandyApiRequest(requestId, endpoint, options = {}) {
  return makeApiRequest(requestId, NORMANDY_API_ROOT_URL, endpoint, options);
}

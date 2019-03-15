import { NORMANDY_ADMIN_API_ROOT_URL, NORMANDY_READONLY_API_ROOT_URL } from 'console/settings';
import {
  NETWORK_NORMANDY_ADMIN_AVAILABLE,
  REQUEST_FAILURE,
  REQUEST_SEND,
  REQUEST_SUCCESS,
} from 'console/state/action-types';
import { getAccessToken } from 'console/state/auth/selectors';
import { getRequest } from 'console/state/network/selectors';
import APIClient from 'console/utils/api';

const SECONDS = 1000;

export function makeApiRequest(requestId, root, endpoint = '', options = {}) {
  return async (dispatch, getState) => {
    const state = getState();
    const accessToken = getAccessToken(state);
    const api = new APIClient(root, accessToken);
    const request = getRequest(state, requestId);

    // A "stealth API request" is one that doesn't update the state.
    // This is useful when you generally "don't care" about the *state* of the request.
    const stealth = options.stealth || false;
    if (stealth) {
      // Doing it this way because JavaScript doesn't have a `obj.pop(key, default)`
      delete options.stealth;
    }

    if (request.inProgress) {
      return true;
    }

    if (!stealth) {
      dispatch({
        type: REQUEST_SEND,
        requestId,
      });
    }

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
  return makeApiRequest(requestId, NORMANDY_ADMIN_API_ROOT_URL, endpoint, options);
}

export function makeNormandyReadonlyApiRequest(requestId, endpoint, options = {}) {
  return makeApiRequest(requestId, NORMANDY_READONLY_API_ROOT_URL, endpoint, options);
}

export function detectNormandyAdmin() {
  return async (dispatch, getState) => {
    const state = getState();
    let url = NORMANDY_ADMIN_API_ROOT_URL + 'v3/';
    const requestId = 'detect-normandy-admin';
    const ADMIN_TIMEOUT = 3 * SECONDS;

    const request = getRequest(state, requestId);
    if (request.inProgress) {
      return;
    }

    dispatch({ type: REQUEST_SEND, requestId });

    const adminPromise = fetch(url);
    let timeoutPromise = new Promise((resolve, reject) => {
      setTimeout(() => reject(new Error('timeout contacting Normandy admin')), ADMIN_TIMEOUT);
    });

    try {
      // if this succeeds, then the normandy admin is available
      await Promise.race([adminPromise, timeoutPromise]);
      dispatch({ type: REQUEST_SUCCESS, requestId });
      dispatch({ type: NETWORK_NORMANDY_ADMIN_AVAILABLE, available: true });
    } catch (error) {
      // If it fails, it could be a network failure, or the timeout. Either way,
      // the admin is not available
      dispatch({ type: REQUEST_FAILURE, requestId, error });
      dispatch({ type: NETWORK_NORMANDY_ADMIN_AVAILABLE, available: false });
    }
  };
}

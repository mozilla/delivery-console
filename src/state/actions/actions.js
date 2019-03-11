import { ACTIONS_RECEIVE, ACTION_RECEIVE } from 'console/state/action-types';
import {
  makeApiRequest,
  makeNormandyApiRequest,
  makeNormandyReadonlyApiRequest,
} from 'console/state/network/actions';
import { isNormandyAdminAvailable } from 'console/state/network/selectors';

export function fetchAction(pk) {
  return async (dispatch, getState) => {
    const state = getState();
    console.log('fetchAction', isNormandyAdminAvailable(state));
    const fetcher = isNormandyAdminAvailable(state)
      ? makeNormandyApiRequest
      : makeNormandyReadonlyApiRequest;

    const requestId = `fetch-action-${pk}`;
    const action = await dispatch(fetcher(requestId, `v3/action/${pk}/`));

    dispatch({
      type: ACTION_RECEIVE,
      action,
    });
  };
}

export function fetchAllActions() {
  return async (dispatch, getState) => {
    const state = getState();
    console.log('fetchAllActions', isNormandyAdminAvailable(state));
    const fetcher = isNormandyAdminAvailable(state)
      ? makeNormandyApiRequest
      : makeNormandyReadonlyApiRequest;
    const requestId = 'fetch-all-actions';
    let response = await dispatch(fetcher(requestId, 'v3/action/'));
    let actions = response.results;

    while (actions) {
      dispatch({
        type: ACTIONS_RECEIVE,
        actions,
      });

      if (response.next) {
        response = await dispatch(makeApiRequest(requestId, response.next));
        actions = response.results;
      } else {
        actions = null;
      }
    }
  };
}

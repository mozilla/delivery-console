import { ACTION_RECEIVE } from 'console/state/action-types';
import { makeApiRequest, makeNormandyApiRequest } from 'console/state/network/actions';

export function fetchAction(pk) {
  return async dispatch => {
    const requestId = `fetch-action-${pk}`;
    const action = await dispatch(makeNormandyApiRequest(requestId, `v3/action/${pk}/`));

    dispatch({
      type: ACTION_RECEIVE,
      action,
    });
  };
}

export function fetchAllActions() {
  return async dispatch => {
    const requestId = 'fetch-all-actions';
    let response = await dispatch(makeNormandyApiRequest(requestId, 'v3/action/'));
    let actions = response.results;

    while (actions) {
      actions.forEach(action => {
        dispatch({
          type: ACTION_RECEIVE,
          action,
        });
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

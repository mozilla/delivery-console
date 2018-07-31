import { ACTION_RECEIVE } from 'console/state/action-types';
import { makeNormandyApiRequest } from 'console/state/network/actions';

export function fetchAction(pk) {
  return async dispatch => {
    const requestId = `fetch-action-${pk}`;
    const action = await dispatch(makeNormandyApiRequest(requestId, `v2/action/${pk}/`));

    dispatch({
      type: ACTION_RECEIVE,
      action,
    });
  };
}

export function fetchAllActions() {
  return async dispatch => {
    const requestId = 'fetch-all-actions';
    const actions = await dispatch(makeNormandyApiRequest(requestId, 'v2/action/'));

    actions.forEach(action => {
      dispatch({
        type: ACTION_RECEIVE,
        action,
      });
    });
  };
}

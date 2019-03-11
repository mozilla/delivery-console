import { DEFAULT_REQUEST } from 'console/state/constants';

export function getNetworkState(state) {
  return state.get('network');
}

export function getRequestsState(state) {
  return getNetworkState(state).get('requests');
}

export function getAvailabilityState(state) {
  return getNetworkState(state).get('availability');
}

export function getRequest(state, id, defaultsTo = DEFAULT_REQUEST) {
  return getRequestsState(state).get(id, defaultsTo);
}

export function isRequestInProgress(state, id) {
  const request = getRequest(state, id);
  return request.get('inProgress', false);
}

export function areAnyRequestsInProgress(state) {
  const requests = getRequestsState(state);

  if (requests.size === 0) {
    return false;
  } else if (requests.size === 1) {
    return requests.first().get('inProgress', false);
  }

  return requests
    .reduce((reduced, value) =>
      reduced.set('inProgress', reduced.get('inProgress') || value.get('inProgress')),
    )
    .get('inProgress', false);
}

export function isNormandyAdminAvailable(state) {
  return getAvailabilityState(state).getIn(['normandyAdmin']);
}

export function isNormandyAdminMaybeAvailable(state) {
  // XXX needs code comment
  return getAvailabilityState(state).getIn(['normandyAdmin']) !== null;
}

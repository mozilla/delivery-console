import { getUser } from 'normandy/state/app/users/selectors';

export function getCurrentUser(state, defaultsTo = null) {
  return getUser(state, state.serviceInfo.get('user_id'), defaultsTo);
}

export function isPeerApprovalEnforced(state) {
  return state.serviceInfo.get('peer_approval_enforced') !== false;
}

export function getLogoutUrl(state, defaultsTo = null) {
  return state.serviceInfo.get('logout_url', defaultsTo);
}

export function getGithubUrl(state, defaultsTo = null) {
  return state.serviceInfo.get('github_url', defaultsTo);
}

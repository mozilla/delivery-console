import { getUser } from 'console/state/users/selectors';

export function getCurrentUser(state, defaultsTo = null) {
  return getUser(state, state.getIn(['serviceInfo', 'user_id']), defaultsTo);
}

export function isPeerApprovalEnforced(state) {
  return state.getIn(['serviceInfo', 'peer_approval_enforced']) !== false;
}

export function getLogoutUrl(state, defaultsTo = null) {
  return state.getIn(['serviceInfo', 'logout_url'], defaultsTo);
}

export function getGithubUrl(state, defaultsTo = null) {
  return state.getIn(['serviceInfo', 'github_url'], defaultsTo);
}

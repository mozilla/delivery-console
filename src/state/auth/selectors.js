export function getUserProfile(state, defaultsTo = null) {
  return state.auth.session.get('profile', defaultsTo);
}

export function getAccessToken(state, defaultsTo = null) {
  return state.auth.session.get('accessToken', defaultsTo);
}

export function getError(state, defaultsTo = null) {
  return state.auth.session.get('error', defaultsTo);
}

export function isSessionExpired(state) {
  const expiresAt = state.session.get('expiresAt', 0);
  return new Date().getTime() >= expiresAt;
}

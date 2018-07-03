export function getUserProfile(state, defaultsTo = null) {
  return state.auth.session.get('profile', defaultsTo);
}

export function getAccessToken(state, defaultsTo = null) {
  return state.auth.session.get('accessToken', defaultsTo);
}

/**
 * Gets the authentication error from the state
 *
 * @param state  The current state
 * @param defaultsTo  A fallback value
 * @returns {Immutable.Map({code: String, description: String})}
 */
export function getError(state, defaultsTo = null) {
  return state.auth.session.get('error', defaultsTo);
}

export function isSessionExpired(state) {
  const expiresAt = state.session.get('expiresAt', 0);
  return new Date().getTime() >= expiresAt;
}

export function isAuthenticationInProgress(state, defaultsTo = false) {
  return state.auth.session.get('inProgress', defaultsTo);
}

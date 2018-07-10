export function getUserProfile(state, defaultsTo = null) {
  return state.getIn(['auth', 'session', 'profile'], defaultsTo);
}

export function getAccessToken(state, defaultsTo = null) {
  return state.getIn(['auth', 'session', 'accessToken'], defaultsTo);
}

/**
 * Gets the authentication error from the state
 *
 * @param state  The current state
 * @param defaultsTo  A fallback value
 * @returns {Immutable.Map({code: String, description: String, time: Integer})}
 */
export function getError(state, defaultsTo = null) {
  return state.getIn(['auth', 'session', 'error'], defaultsTo);
}

export function isSessionExpired(state) {
  const expiresAt = state.getIn(['session', 'expiresAt'], 0);
  return new Date().getTime() >= expiresAt;
}

export function isAuthenticationInProgress(state, defaultsTo = false) {
  return state.getIn(['auth', 'session', 'inProgress'], defaultsTo);
}

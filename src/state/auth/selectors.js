export function getUserInfo(state, defaultsTo = null) {
  return state.auth.loginInfo.get('userInfo', defaultsTo);
}

export function getAccessToken(state, defaultsTo = null) {
  return state.auth.loginInfo.get('accessToken', defaultsTo);
}

export function getError(state, defaultsTo = null) {
  return state.console.loginInfo.get('error', defaultsTo);
}

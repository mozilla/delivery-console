export function getUserInfo(state, defaultsTo = null) {
  return state.auth.loginInfo.get('userInfo', defaultsTo);
}

export function getAccessToken(state, defaultsTo = null) {
  return state.auth.loginInfo.get('accessToken', defaultsTo);
}

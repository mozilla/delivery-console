export function getUserInfo(state, defaultsTo = null) {
  return state.console.loginInfo.get('userInfo', defaultsTo);
}

export function getAccessToken(state, defaultsTo = null) {
  return state.console.loginInfo.get('accessToken', defaultsTo);
}

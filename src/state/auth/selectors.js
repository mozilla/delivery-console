export function getUserInfo(state, defaultsTo = null) {
  const got = state.auth.loginInfo.get('userInfo', defaultsTo);
  if (got && typeof got === 'string') {
    return JSON.parse(got);
  }
  return got;
}

export function getAccessToken(state, defaultsTo = null) {
  const accessToken = state.auth.loginInfo.get('accessToken', defaultsTo);
  if (accessToken && typeof accessToken === 'string') {
    try {
      return JSON.parse(accessToken);
    } catch (ex) {
      console.warn('Unrecognized accessToken string:', accessToken);
      throw ex;
    }
  }
  return accessToken;
}

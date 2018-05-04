export function getUserInfo(state, defaultsTo = null) {
  const got = state.auth.loginInfo.get('userInfo', defaultsTo);
  if (got && typeof got === 'string') {
    return JSON.parse(got);
  }
  return got;
}

export function getAccessToken(state, defaultsTo = null) {
  // XXX Terrible name
  const got = state.auth.loginInfo.get('accessToken', defaultsTo);
  if (got && typeof got === 'string') {
    console.log('GOT:', got);
    try {
      return JSON.parse(got);
    } catch (ex) {
      console.warn('Unrecognized accessToken string:', got);
      throw ex;
    }
  }
  return got;
}

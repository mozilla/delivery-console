import PropTypes from 'prop-types';
import React from 'react';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';

import { loginFailed, logUserIn, userProfileReceived } from 'console/state/auth/actions';
import { getAccessToken } from 'console/state/auth/selectors';
import { finishAuthenticationFlow, refreshAuthentication } from 'console/utils/auth0';
import { REFRESH_AUTH_PREEMPTIVE_SECONDS, REFRESH_AUTH_PERIOD_SECONDS } from 'console/settings';

@connect(
  (state, props) => ({
    accessToken: getAccessToken(state),
  }),
  {
    loginFailed,
    logUserIn,
    userProfileReceived,
  },
)
@withRouter
export default class QueryAuth0 extends React.PureComponent {
  static propTypes = {
    accessToken: PropTypes.string,
    history: PropTypes.object.isRequired,
    loginFailed: PropTypes.func.isRequired,
    logUserIn: PropTypes.func.isRequired,
    userProfileReceived: PropTypes.func.isRequired,
  };

  async componentDidMount() {
    const { loginFailed } = this.props;
    let authResult;

    try {
      authResult = await finishAuthenticationFlow();
    } catch (err) {
      loginFailed(err);
    }

    if (!authResult) {
      // It if was null from finishAuthenticationFlow() it means it didn't pick anything
      // up from the window.location.hash so we can potentially use what was stored in
      // localStorage.
      authResult = JSON.parse(localStorage.getItem('authResult'));
    }

    if (authResult) {
      this.postProcessAuthResult(authResult);

      // Start a never-ending loop over periodically checking if the accessToken is about to
      // or has expired.
      await this.accessTokenRefreshLoop();
    }
  }

  postProcessAuthResult = authResult => {
    const { history, logUserIn, userProfileReceived } = this.props;
    const { state } = authResult;
    logUserIn(authResult);
    // Since we include 'id_token' for the 'responseType' in auth0.WebAuth
    // the authresult will contain the user profile as .idTokenPayload
    // included with the accessToken. Use this now to update the state so that we
    // can display the name and avatar you logged in as.
    userProfileReceived(authResult.idTokenPayload);

    if (state) {
      history.push(state);
    }
  };

  async accessTokenRefreshLoop() {
    if (!localStorage.getItem('expiresAt')) {
      // The user has logged out probably. Either way, no point bothering to refresh.
      return;
    }
    const expiresAt = JSON.parse(localStorage.getItem('expiresAt'));
    const left = expiresAt - new Date().getTime();
    const preemptive = REFRESH_AUTH_PREEMPTIVE_SECONDS * 1000;

    const accessTokenRefreshLoopTimer = window.setTimeout(async () => {
      await this.accessTokenRefreshLoop();
    }, REFRESH_AUTH_PERIOD_SECONDS * 1000);

    if (left - preemptive < 0) {
      // Time to refresh!
      console.warn('Time to refresh auth session');
      try {
        const authResult = await refreshAuthentication(this.props.location.pathname);
        this.postProcessAuthResult(authResult);
      } catch (err) {
        window.clearTimeout(accessTokenRefreshLoopTimer);
        console.error(err);
        this.props.loginFailed(err);
      }
    }
  }

  render() {
    return null;
  }
}

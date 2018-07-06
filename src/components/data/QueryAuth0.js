import autobind from 'autobind-decorator';
import { push } from 'connected-react-router';
import PropTypes from 'prop-types';
import React from 'react';
import { connect } from 'react-redux';

import {
  authenticationFailed,
  logUserIn,
  logUserOut,
  userProfileReceived,
} from 'console/state/auth/actions';
import { getAccessToken } from 'console/state/auth/selectors';
import { CHECK_AUTH_EXPIRY_INTERVAL_SECONDS } from 'console/settings';
import { parseHash, checkSession } from 'console/utils/auth0';
import { getCurrentPathname } from 'console/state/router/selectors';

@connect(
  (state, props) => ({
    accessToken: getAccessToken(state),
    pathname: getCurrentPathname(state),
  }),
  {
    authenticationFailed,
    logUserIn,
    logUserOut,
    userProfileReceived,
    push,
  },
)
@autobind
export default class QueryAuth0 extends React.PureComponent {
  static propTypes = {
    accessToken: PropTypes.string,
    authenticationFailed: PropTypes.func.isRequired,
    logUserIn: PropTypes.func.isRequired,
    logUserOut: PropTypes.func.isRequired,
    pathname: PropTypes.string.isRequired,
    push: PropTypes.func.isRequired,
    userProfileReceived: PropTypes.func.isRequired,
  };

  constructor(props) {
    super(props);
    this.state = {};
  }

  async componentDidMount() {
    const { authenticationFailed } = this.props;
    let authResult;
    let expiresAt;

    // Check whether we are currently in an auth flow
    try {
      authResult = await parseHash();
    } catch (err) {
      authenticationFailed(err);
    }

    // If not check if the user has a locally stored authResult
    if (!authResult) {
      expiresAt = JSON.parse(localStorage.getItem('expiresAt'));
      if (expiresAt && expiresAt - new Date().getTime() > 0) {
        authResult = JSON.parse(localStorage.getItem('authResult'));
      }
    }

    if (authResult) {
      // If we have a valid authResult log the user in
      this.processAuthResult(authResult);
    } else if (expiresAt && expiresAt - new Date().getTime() < 0) {
      // If we do not have an expired authResult attempt to refresh it
      this.refreshAccessToken();
    }
  }

  componentDidUpdate(prevProps) {
    const { accessToken } = this.props;

    if (accessToken && accessToken !== prevProps.accessToken) {
      // Check the access token now
      this.checkAccessToken();

      // Set up periodic checks of the access token
      this.setState(() => ({
        checkAccessTokenInterval: window.setInterval(
          this.checkAccessToken,
          CHECK_AUTH_EXPIRY_INTERVAL_SECONDS * 1000,
        ),
      }));
    } else if (!accessToken) {
      // There is no access token so stop periodic checks
      this.clearAccessTokenInterval();
    }
  }

  componentWillUnmount() {
    this.clearAccessTokenInterval();
  }

  processAuthResult(authResult) {
    const { logUserIn, userProfileReceived } = this.props;
    const { state: redirectUrl } = authResult;

    logUserIn(authResult);
    userProfileReceived(authResult.idTokenPayload);

    if (redirectUrl) {
      this.props.push(redirectUrl);
    }
  }

  checkAccessToken() {
    const { accessToken } = this.props;
    if (accessToken) {
      const expiresAt = JSON.parse(localStorage.getItem('expiresAt'));
      const expiresIn = expiresAt - new Date().getTime();

      if (expiresIn / 1000 <= CHECK_AUTH_EXPIRY_INTERVAL_SECONDS) {
        // The token will expire before we check again so attempt a refresh now
        this.refreshAccessToken();
      }
    }
  }

  clearAccessTokenInterval() {
    const { checkAccessTokenInterval } = this.state;
    if (checkAccessTokenInterval) {
      window.clearInterval(checkAccessTokenInterval);
    }
  }

  async refreshAccessToken() {
    console.info('Refreshing the auth0 access token');

    try {
      const authResult = await checkSession(this.props.pathname);
      this.processAuthResult(authResult);
    } catch (err) {
      if (err && err.code === 'login_required') {
        // Refreshing the token failed and a fresh login is required so log the user out
        this.clearAccessTokenInterval();
        this.props.logUserOut();
      } else {
        this.props.authenticationFailed(err);
      }
    }
  }

  render() {
    return null;
  }
}

import autobind from 'autobind-decorator';
import { push } from 'connected-react-router';
import PropTypes from 'prop-types';
import React from 'react';
import { connect } from 'react-redux';

import {
  authenticationFailed,
  logUserIn,
  logUserInInsecure,
  logUserOut,
  userProfileReceived,
} from 'console/state/auth/actions';
import { getAccessToken, isInsecureAuth } from 'console/state/auth/selectors';
import { CHECK_AUTH_EXPIRY_INTERVAL_MS, INSECURE_AUTH_ALLOWED } from 'console/settings';
import { parseHash, checkSession } from 'console/utils/auth0';
import { getCurrentPathname } from 'console/state/router/selectors';

@connect(
  (state, props) => ({
    accessToken: getAccessToken(state),
    isInsecure: isInsecureAuth(state),
    pathname: getCurrentPathname(state),
  }),
  {
    authenticationFailed,
    logUserIn,
    logUserInInsecure,
    logUserOut,
    userProfileReceived,
    push,
  },
)
@autobind
class QueryAuth0 extends React.PureComponent {
  static propTypes = {
    accessToken: PropTypes.string,
    authenticationFailed: PropTypes.func.isRequired,
    isInsecureAuth: PropTypes.bool.isRequired,
    logUserIn: PropTypes.func.isRequired,
    logUserInInsecure: PropTypes.func.isRequired,
    logUserOut: PropTypes.func.isRequired,
    pathname: PropTypes.string.isRequired,
    push: PropTypes.func.isRequired,
    userProfileReceived: PropTypes.func.isRequired,
  };

  static defaultProps = {
    isInsecureAuth: false,
  };

  async componentDidMount() {
    this.checkForAuthentication();

    window.addEventListener('focus', this.checkForAuthentication);
  }

  componentDidUpdate(prevProps) {
    const { accessToken, isInsecure } = this.props;

    if (accessToken && accessToken !== prevProps.accessToken && !isInsecure) {
      // Check the access token now
      this.validateAccessToken();

      // Set up periodic checks of the access token
      this.validateAccessTokenInterval = window.setInterval(
        this.validateAccessToken,
        CHECK_AUTH_EXPIRY_INTERVAL_MS,
      );
    } else if (!accessToken) {
      // There is no access token so stop periodic checks
      this.clearValidateAccessTokenInterval();
    }
  }

  componentWillUnmount() {
    // Depending on where this component is mounted this may never get called
    this.clearValidateAccessTokenInterval();
    window.removeEventListener('focus', this.checkForAuthentication);
  }

  async checkForAuthentication() {
    const { accessToken, authenticationFailed, isInsecureAuth } = this.props;
    let authResult;
    let expiresAt;
    let email;

    // Check whether we are currently in an auth flow
    try {
      authResult = await parseHash();
    } catch (err) {
      authenticationFailed(err);
    }

    // If not check if the user has a locally stored authResult
    if (!authResult) {
      expiresAt = JSON.parse(localStorage.getItem('authExpiresAt'));
      if (expiresAt && expiresAt - new Date().getTime() > 0) {
        authResult = JSON.parse(localStorage.getItem('authResult'));
      }
      if (!authResult) {
        email = localStorage.getItem('authEmail');
      }
    }

    if (authResult) {
      // If we have a valid authResult log the user in
      this.processAuthResult(authResult);
    } else if (expiresAt && expiresAt - new Date().getTime() < 0) {
      // If we do not have an expired authResult attempt to refresh it
      this.refreshAccessToken();
    } else if (email && INSECURE_AUTH_ALLOWED) {
      this.props.logUserInInsecure(email);
    } else if (!authResult && accessToken && !isInsecureAuth) {
      this.props.logUserOut();
    }
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

  validateAccessToken() {
    const { accessToken, isInsecure } = this.props;
    if (accessToken && !isInsecure) {
      const expiresAt = JSON.parse(localStorage.getItem('authExpiresAt'));
      const expiresIn = expiresAt - new Date().getTime();

      if (expiresIn <= CHECK_AUTH_EXPIRY_INTERVAL_MS) {
        // The token will expire before we check again so attempt a refresh now
        this.refreshAccessToken();
      }
    }
  }

  clearValidateAccessTokenInterval() {
    if (this.validateAccessTokenInterval) {
      window.clearInterval(this.validateAccessTokenInterval);
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
        this.clearValidateAccessTokenInterval();
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

export default QueryAuth0;

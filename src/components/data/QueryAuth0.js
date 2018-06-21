import PropTypes from 'prop-types';
import React from 'react';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';

import { loginFailed, logUserIn, userProfileReceived } from 'console/state/auth/actions';
import { getAccessToken } from 'console/state/auth/selectors';
import { finishAuthenticationFlow } from 'console/utils/auth0';

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
    const { history, loginFailed, logUserIn, userProfileReceived } = this.props;
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
    }
  }

  render() {
    return null;
  }
}

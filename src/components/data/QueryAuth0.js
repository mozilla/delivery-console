import PropTypes from 'prop-types';
import React from 'react';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';

import {
  fetchUserProfile,
  loginFailed,
  logUserIn,
} from 'console/state/auth/actions';
import { getAccessToken } from 'console/state/auth/selectors';
import { finishAuthenticationFlow } from 'console/utils/auth0';

@connect(
  (state, props) => ({
    accessToken: getAccessToken(state),
  }),
  {
    fetchUserProfile,
    loginFailed,
    logUserIn,
  },
)
@withRouter
export default class QueryAuth0 extends React.PureComponent {
  static propTypes = {
    accessToken: PropTypes.string,
    fetchUserProfile: PropTypes.func.isRequired,
    history: PropTypes.object.isRequired,
    loginFailed: PropTypes.func.isRequired,
    logUserIn: PropTypes.func.isRequired,
  };

  async componentWillMount() {
    let authResult;

    try {
      authResult = await finishAuthenticationFlow();
    } catch (err) {
      loginFailed(err);
    }

    if (!authResult) {
      authResult = JSON.parse(localStorage.getItem('authResult'));
    }

    if (authResult) {
      const { state } = authResult;
      this.props.logUserIn(authResult);
      this.props.fetchUserProfile(authResult.accessToken);

      if (state) {
        this.props.history.push(state);
      }
    }
  }

  render() {
    return null;
  }
}

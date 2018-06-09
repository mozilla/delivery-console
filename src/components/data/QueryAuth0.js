import PropTypes from 'prop-types';
import React from 'react';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';

import { fetchUserProfile, loginFailed, logUserIn } from 'console/state/auth/actions';
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
    const { fetchUserProfile, history, loginFailed, logUserIn } = this.props;
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
      logUserIn(authResult);
      fetchUserProfile(authResult.accessToken);

      if (state) {
        history.push(state);
      }
    }
  }

  componentWillReceiveProps(nextProps) {
    const { accessToken, fetchUserProfile } = this.props;
    if (nextProps.accessToken && accessToken !== nextProps.accessToken) {
      fetchUserProfile(nextProps.accessToken);
    }
  }

  render() {
    return null;
  }
}

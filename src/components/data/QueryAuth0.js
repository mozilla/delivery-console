import PropTypes from 'prop-types';
import React from 'react';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';

import { fetchUserProfile, logUserIn } from 'console/state/auth/actions';
import { getAccessToken } from 'console/state/auth/selectors';
import { finishAuthenticationFlow } from 'console/utils/auth0';

@connect(
  (state, props) => ({
    accessToken: getAccessToken(state),
  }),
  {
    fetchUserProfile,
    logUserIn,
  },
)
@withRouter
export default class QueryAuth0 extends React.PureComponent {
  static propTypes = {
    accessToken: PropTypes.string,
    fetchUserProfile: PropTypes.func.isRequired,
    history: PropTypes.object.isRequired,
    logUserIn: PropTypes.func.isRequired,
  };

  async componentWillMount() {
    let authResult;

    try {
      authResult = await finishAuthenticationFlow();
    } catch (err) {
      // TODO: Handle login failure
      console.log(err);
    }

    if (!authResult) {
      authResult = JSON.parse(localStorage.getItem('authResult') || 'null');
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

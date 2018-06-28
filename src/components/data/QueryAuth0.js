import PropTypes from 'prop-types';
import React from 'react';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';

import { authenticationFailed, fetchUserProfile, logUserIn } from 'console/state/auth/actions';
import { parseHash } from '../../utils/auth0';
import { getAccessToken } from 'console/state/auth/selectors';

@connect(
  (state, props) => ({
    accessToken: getAccessToken(state),
  }),
  {
    authenticationFailed,
    fetchUserProfile,
    logUserIn,
  },
)
@withRouter
export default class QueryAuth0 extends React.PureComponent {
  static propTypes = {
    accessToken: PropTypes.string,
    authenticationFailed: PropTypes.func.isRequired,
    fetchUserProfile: PropTypes.func.isRequired,
    history: PropTypes.object.isRequired,
    logUserIn: PropTypes.func.isRequired,
  };

  async componentWillMount() {
    const { authenticationFailed, fetchUserProfile, history, logUserIn } = this.props;
    let authResult;

    try {
      authResult = await parseHash();
    } catch (err) {
      authenticationFailed(err);
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

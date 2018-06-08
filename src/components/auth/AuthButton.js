import { Button } from 'antd';
import PropTypes from 'prop-types';
import React from 'react';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';

import { logUserOut } from 'console/state/auth/actions';
import { getUserProfile } from 'console/state/auth/selectors';
import { startAuthenticationFlow } from 'console/utils/auth0';

@connect(
  (state, props) => ({
    userProfile: getUserProfile(state),
  }),
  {
    logUserOut,
  },
)
@withRouter
export default class AuthButton extends React.Component {
  static propTypes = {
    logUserOut: PropTypes.func.isRequired,
    userProfile: PropTypes.object,
  };

  render() {
    if (this.props.userProfile) {
      const nickname = this.props.userProfile.get('nickname');
      return (
        <Button
          onClick={this.props.logUserOut}
        >{`Logged in as ${nickname}`}</Button>
      );
    }

    return (
      <Button
        onClick={() => startAuthenticationFlow(this.props.location.pathname)}
      >
        Login
      </Button>
    );
  }
}

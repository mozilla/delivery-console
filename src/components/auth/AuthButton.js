import { Avatar, Button, Icon, Popover } from 'antd';
import PropTypes from 'prop-types';
import React from 'react';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';

import { logUserOut, setAuthStarted } from 'console/state/auth/actions';
import { getAuthStarted, getUserProfile } from 'console/state/auth/selectors';
import { startAuthenticationFlow } from 'console/utils/auth0';

@connect(
  (state, props) => ({
    userProfile: getUserProfile(state),
    authStarted: getAuthStarted(state),
  }),
  {
    logUserOut,
    setAuthStarted,
  },
)
@withRouter
export default class AuthButton extends React.Component {
  static propTypes = {
    authStarted: PropTypes.bool.isRequired,
    logUserOut: PropTypes.func.isRequired,
    setAuthStarted: PropTypes.func.isRequired,
    userProfile: PropTypes.object,
  };

  popoverTitle(userProfile) {
    const nickname = userProfile.get('nickname');
    const email = userProfile.get('email');
    return (
      <div title={`Email: ${email}`}>
        <div className="no-bold">Logged in as</div>
        {nickname}
      </div>
    );
  }

  menu() {
    return (
      <div>
        <div className="text-colored-links">
          <a onClick={this.props.logUserOut}>Log Out</a>
        </div>
      </div>
    );
  }

  render() {
    if (this.props.userProfile) {
      const picture = this.props.userProfile.get('picture');
      return (
        <Popover
          content={this.menu()}
          title={this.popoverTitle(this.props.userProfile)}
          trigger="click"
          placement="bottomRight"
        >
          <a className="ant-dropdown-link">
            <Avatar src={picture} icon="user" />
            <Icon type="caret-down" />
          </a>
        </Popover>
      );
    }

    return (
      <Button
        type="primary"
        loading={this.props.authStarted}
        onClick={() => {
          this.props.setAuthStarted(true);
          startAuthenticationFlow(this.props.location.pathname);

          // In case you have terrible network, the going to the auth0 page might be slow.
          // Or, it might be stuck. Or, the user hits Esc to cancel the redirect.
          window.setTimeout(() => {
            this.props.setAuthStarted(false);
          }, 3000);
        }}
      >
        Log In
      </Button>
    );
  }
}

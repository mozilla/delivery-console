import { Avatar, Button, Icon, Popover } from 'antd';
import PropTypes from 'prop-types';
import React from 'react';
import { connect } from 'react-redux';

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
export default class AuthButton extends React.Component {
  static propTypes = {
    logUserOut: PropTypes.func.isRequired,
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
      <Button type="primary" onClick={() => startAuthenticationFlow(this.props.location.pathname)}>
        Log In
      </Button>
    );
  }
}

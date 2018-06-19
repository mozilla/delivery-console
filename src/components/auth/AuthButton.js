import { Avatar, Button, Icon, Popover } from 'antd';
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

  popoverTitle(nickname) {
    return (
      <div>
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
      const nickname = this.props.userProfile.get('nickname');
      const picture = this.props.userProfile.get('picture');
      return (
        <Popover
          content={this.menu()}
          title={this.popoverTitle(nickname)}
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

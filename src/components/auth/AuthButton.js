import { Avatar, Button, Icon, Popover } from 'antd';
import autobind from 'autobind-decorator';
import PropTypes from 'prop-types';
import React from 'react';
import { connect } from 'react-redux';

import {
  finishAuthenticationFlow,
  logUserOut,
  startAuthenticationFlow,
} from 'console/state/auth/actions';
import { isAuthenticationInProgress, getUserProfile } from 'console/state/auth/selectors';
import { getCurrentPathname } from 'console/state/router/selectors';

@connect(
  (state, props) => ({
    authInProgress: isAuthenticationInProgress(state),
    pathname: getCurrentPathname(state),
    userProfile: getUserProfile(state),
  }),
  {
    finishAuthenticationFlow,
    logUserOut,
    startAuthenticationFlow,
  },
)
@autobind
export default class AuthButton extends React.Component {
  static propTypes = {
    authInProgress: PropTypes.bool.isRequired,
    finishAuthenticationFlow: PropTypes.func.isRequired,
    logUserOut: PropTypes.func.isRequired,
    pathname: PropTypes.string.isRequired,
    startAuthenticationFlow: PropTypes.func.isRequired,
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

  handleLoginTimeout() {
    this.props.finishAuthenticationFlow();
  }

  handleLoginClick() {
    this.props.startAuthenticationFlow(this.props.pathname);

    // In case you have terrible network, the going to the auth0 page might be slow.
    // Or, it might be stuck. Or, the user hits Esc to cancel the redirect.
    window.setTimeout(this.handleLoginTimeout, 3000);
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
      <Button type="primary" loading={this.props.authInProgress} onClick={this.handleLoginClick}>
        Log In
      </Button>
    );
  }
}

import { Avatar, Button, Icon, Input, Modal, Popover } from 'antd';
import autobind from 'autobind-decorator';
import PropTypes from 'prop-types';
import React from 'react';
import { connect } from 'react-redux';

import { INSECURE_AUTH_ALLOWED } from 'console/settings';
import {
  finishAuthenticationFlow,
  logUserInInsecure,
  logUserOut,
  startAuthenticationFlow,
} from 'console/state/auth/actions';
import {
  isAuthenticationInProgress,
  getAccessToken,
  getUserProfile,
} from 'console/state/auth/selectors';
import { getCurrentPathname } from 'console/state/router/selectors';

@connect(
  (state, props) => ({
    accessToken: getAccessToken(state),
    authInProgress: isAuthenticationInProgress(state),
    pathname: getCurrentPathname(state),
    userProfile: getUserProfile(state),
  }),
  {
    finishAuthenticationFlow,
    logUserInInsecure,
    logUserOut,
    startAuthenticationFlow,
  },
)
@autobind
class AuthButton extends React.Component {
  static propTypes = {
    accessToken: PropTypes.string,
    authInProgress: PropTypes.bool.isRequired,
    finishAuthenticationFlow: PropTypes.func.isRequired,
    logUserInInsecure: PropTypes.func.isRequired,
    logUserOut: PropTypes.func.isRequired,
    pathname: PropTypes.string.isRequired,
    startAuthenticationFlow: PropTypes.func.isRequired,
    userProfile: PropTypes.object,
  };

  constructor(props) {
    super(props);

    this.state = {
      email: '',
      modalVisible: false,
    };
  }

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

  logInMenu() {
    return (
      <div>
        <div className="text-colored-links">
          <div>
            <a href="#login-email" onClick={this.handleEmailLoginClick}>
              Log in with email
            </a>
          </div>
          <div>
            <a href="#login-auth0" onClick={this.handleAuth0LoginClick}>
              Log in with Auth0
            </a>
          </div>
        </div>
      </div>
    );
  }

  logOutMenu() {
    return (
      <div>
        <div className="text-colored-links">
          <a href="#copy" onClick={this.handleCopyAuthTokenClick}>
            Copy Auth Token
          </a>
        </div>
        <div className="text-colored-links">
          <a href="#logout" onClick={this.props.logUserOut}>
            Log Out
          </a>
        </div>
      </div>
    );
  }

  handleCopyAuthTokenClick(ev) {
    ev.preventDefault();
    const tokenSpan = document.querySelector('#copyable-auth-token');
    tokenSpan.select();
    document.execCommand('copy');
    Modal.success({
      title: 'Access token was copied to clipboard.',
    });
  }

  handleLoginTimeout() {
    this.props.finishAuthenticationFlow();
  }

  handleAuth0LoginClick() {
    this.props.startAuthenticationFlow(this.props.pathname);

    // In case you have terrible network, the going to the auth0 page might be slow.
    // Or, it might be stuck. Or, the user hits Esc to cancel the redirect.
    window.setTimeout(this.handleLoginTimeout, 3000);
  }

  handleEmailLoginClick() {
    this.setState({ modalVisible: true });
  }

  handleEmailLogin() {
    this.props.logUserInInsecure(this.state.email);
  }

  hideModal() {
    this.setState({ modalVisible: false });
  }

  render() {
    const { accessToken } = this.props;

    if (this.props.userProfile) {
      const picture = this.props.userProfile.get('picture');
      return (
        <React.Fragment>
          <Popover
            content={this.logOutMenu()}
            title={this.popoverTitle(this.props.userProfile)}
            trigger="click"
            placement="bottomRight"
          >
            <span className="user-button">
              <Avatar src={picture} icon="user" />
              <Icon type="caret-down" />
            </span>
          </Popover>
          <div className="hide-offscreen">
            <input id="copyable-auth-token" value={accessToken} />
          </div>
        </React.Fragment>
      );
    }
    if (INSECURE_AUTH_ALLOWED) {
      return (
        <React.Fragment>
          <Popover
            content={this.logInMenu()}
            title="Log In Options"
            trigger="click"
            placement="bottomRight"
          >
            <Button type="primary" loading={this.props.authInProgress}>
              Log In
            </Button>
          </Popover>
          <Modal
            title="Log in with email"
            visible={this.state.modalVisible}
            onOk={this.handleEmailLogin}
            onCancel={this.hideModal}
          >
            <Input
              placeholder="E-mail Address"
              type="email"
              onChange={e => {
                this.setState({ email: e.target.value });
              }}
            />
          </Modal>
        </React.Fragment>
      );
    }
    return (
      <Button
        type="primary"
        loading={this.props.authInProgress}
        onClick={this.handleAuth0LoginClick}
      >
        Log In
      </Button>
    );
  }
}

export default AuthButton;

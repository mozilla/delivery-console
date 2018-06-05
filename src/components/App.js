import { Button, Layout } from 'antd';
import PropTypes from 'prop-types';
import React from 'react';
import { BrowserRouter, NavLink } from 'react-router-dom';
import 'console/less/layout.less';
import { connect } from 'react-redux';

import {
  endSession,
  finishAuthenticationFlow,
  fetchUserInfo,
  getAuthenticationInfoFromSession,
  startAuthenticationFlow,
} from 'console/utils/auth0';
import { logUserIn, logUserOut, setUserInfo } from 'console/state/auth/actions';
import { getAccessToken, getUserInfo } from 'console/state/auth/selectors';

import AppRouter from 'console/components/router';
import QueryActions from 'console/components/data/QueryActions';
import QueryServiceInfo from 'console/components/data/QueryServiceInfo';
const { Header, Content } = Layout;

const CurrentUserInfo = props => {
  if (props.userInfo) {
    return (
      <Button onClick={props.onLogoutClick}>{`Logged in as ${props.userInfo.get(
        'nickname',
      )}`}</Button>
    );
  } else {
    return <Button onClick={props.onLoginClick}>Login</Button>;
  }
};

@connect(
  (state, props) => ({
    accessToken: getAccessToken(state),
    userInfo: getUserInfo(state),
  }),
  { logUserIn, logUserOut, setUserInfo },
)
export default class App extends React.Component {
  static propTypes = {
    accessToken: PropTypes.object,
    logUserIn: PropTypes.func.isRequired,
    logUserOut: PropTypes.func.isRequired,
    setUserInfo: PropTypes.func.isRequired,
    userInfo: PropTypes.object,
  };

  componentDidMount = () => {
    // Check if we are in the middle of the authentication flow and attempt to complete
    finishAuthenticationFlow(this.onLoggedIn);

    const authInfo = getAuthenticationInfoFromSession();
    if (authInfo) {
      this.onLoggedIn(authInfo);
    }
  };

  onLoginClick = () => {
    // Start the login redirection dance.
    startAuthenticationFlow();
  };

  onLoggedIn = authResult => {
    if (authResult) {
      this.props.logUserIn(authResult);
    }
    if (!this.props.userInfo) {
      fetchUserInfo(this.onUserInfo);
    }
  };

  onUserInfo = userInfo => {
    this.props.setUserInfo(userInfo);
  };

  onLogoutClick = () => {
    endSession();
    this.props.logUserOut();
  };

  render() {
    return (
      <BrowserRouter>
        <Layout>
          <QueryActions />

          {this.props.accessToken ? (
            <QueryServiceInfo
              accessToken={this.props.accessToken.accessToken}
            />
          ) : null}

          <Header className="app-header">
            <h1>Delivery Console</h1>

            <NavLink exact to="/">
              Home
            </NavLink>
            <NavLink to="/recipe">Recipes</NavLink>
            <NavLink to="/extension">Extensions</NavLink>

            <CurrentUserInfo
              userInfo={this.props.userInfo}
              onLogoutClick={this.onLogoutClick}
              onLoginClick={this.onLoginClick}
            />
          </Header>

          <Layout className="content-wrapper">
            <Content className="content">
              <AppRouter />
            </Content>
          </Layout>
        </Layout>
      </BrowserRouter>
    );
  }
}

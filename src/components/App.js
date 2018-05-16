import { Button, Layout } from 'antd';
import PropTypes from 'prop-types';
import React from 'react';
import { BrowserRouter, NavLink } from 'react-router-dom';
import 'console/less/layout.less';
import { connect } from 'react-redux';

import Error from './Error';
import {
  checkLogin,
  fetchUserInfo,
  isAuthenticated,
  login,
  logout,
} from 'console/utils/auth0';
import {
  setLoginFailed,
  setUserInfo,
  userLogin,
  userLogout,
} from 'console/state/auth/actions';
import {
  getAccessToken,
  getError,
  getUserInfo,
} from 'console/state/auth/selectors';

import AppRouter from 'console/components/router';
import QueryActions from 'console/components/data/QueryActions';
import QueryServiceInfo from 'console/components/data/QueryServiceInfo';
const { Header, Content } = Layout;

const CurrentUserInfo = props => {
  if (props.userInfo) {
    return (
      <Button onClick={props.onUserLogout}>{`Logged in as ${props.userInfo.get(
        'nickname',
      )}`}</Button>
    );
  } else {
    return <Button onClick={props.onUserLogin}>Login</Button>;
  }
};

@connect(
  (state, props) => ({
    userInfo: getUserInfo(state),
    accessToken: getAccessToken(state),
    error: getError(state),
  }),
  { userLogin, userLogout, setLoginFailed, setUserInfo },
)
export default class App extends React.Component {
  static propTypes = {
    userInfo: PropTypes.instanceOf(Map),
    accessToken: PropTypes.string,
    userLogin: PropTypes.func.isRequired,
    userLogout: PropTypes.func.isRequired,
    setLoginFailed: PropTypes.func.isRequired,
    setUserInfo: PropTypes.func.isRequired,
  };

  componentDidMount = () => {
    checkLogin(this.onLoggedIn, this.onLoginFailed);
    const accessToken = isAuthenticated();
    if (accessToken) {
      this.onLoggedIn({ accessToken });
    }
  };

  onUserLogin = () => {
    // Call auth0.login which will start the login redirection dance.
    login();
  };

  onLoggedIn = authResult => {
    if (authResult && authResult.accessToken) {
      this.props.userLogin(authResult.accessToken);
    }
    if (!this.props.userInfo) {
      fetchUserInfo(this.onUserInfo);
    }
  };

  onLoginFailed = err => {
    this.props.setLoginFailed(`${err.error}: ${err.errorDescription}`);
  };

  onUserInfo = userInfo => {
    this.props.setUserInfo(userInfo);
  };

  onUserLogout = () => {
    logout();
    this.props.userLogout();
  };

  render() {
    return (
      <BrowserRouter>
        <Layout>
          <QueryActions />
          <QueryServiceInfo />
          <Header className="app-header">
            <h1>Delivery Console</h1>

            <NavLink exact to="/">
              Home
            </NavLink>
            <NavLink to="/recipe">Recipes</NavLink>
            <NavLink to="/extension">Extensions</NavLink>

            <CurrentUserInfo
              userInfo={this.props.userInfo}
              onUserLogout={this.onUserLogout}
              onUserLogin={this.onUserLogin}
            />
          </Header>

          <Error error={this.props.error} />

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

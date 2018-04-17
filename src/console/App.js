import { Map } from 'immutable';
import PropTypes from 'prop-types';
import React, { Component } from 'react';
import { connect } from 'react-redux';

import './App.less';
import ConsoleRouter from './Router';

// import Normandy from 'console/App';
import { BrowserRouter, NavLink } from 'react-router-dom';

import {
  checkLogin,
  fetchUserInfo,
  isAuthenticated,
  login,
  logout,
} from './auth0Utils';
import { setUserInfo, userLogin, userLogout } from './actions';
import { getAccessToken, getUserInfo } from './selectors';

import { Button, Layout } from 'antd';
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
  }),
  { userLogin, userLogout, setUserInfo },
)
export default class App extends Component {
  static propTypes = {
    userInfo: PropTypes.instanceOf(Map),
    accessToken: PropTypes.string,
    userLogin: PropTypes.func.isRequired,
    userLogout: PropTypes.func.isRequired,
    setUserInfo: PropTypes.func.isRequired,
  };

  componentDidMount = () => {
    checkLogin(this.onLoggedIn);
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
        <Layout className="app">
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
          <Content className="app-content">
            <ConsoleRouter />
          </Content>
        </Layout>
      </BrowserRouter>
    );
  }
}

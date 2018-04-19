import { Map } from 'immutable';
import PropTypes from 'prop-types';
import React, { Component } from 'react';
import { connect } from 'react-redux';

import 'console/App.less';

import Normandy from 'normandy/App';
import { BrowserRouter, NavLink, Link } from 'react-router-dom';

import { Route, Redirect, Switch } from 'react-router';
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

const Homepage = props => (
  <div>
    <h3>Welcome {props.userInfo ? 'back' : 'home'}!</h3>
    {props.userInfo ? (
      <p>
        Go to the <Link to="/shield">SHIELD control panel</Link>.
      </p>
    ) : (
      <p>You are not logged in! Please use the login button in the header.</p>
    )}
  </div>
);

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
            <NavLink to="/shield">SHIELD</NavLink>

            <CurrentUserInfo
              userInfo={this.props.userInfo}
              onUserLogout={this.onUserLogout}
              onUserLogin={this.onUserLogin}
            />
          </Header>
          <Content className="app-content">
            <Switch>
              {/* Homepage */}
              <Route
                exact
                path="/"
                component={() => <Homepage userInfo={this.props.userInfo} />}
              />

              {/* Normandy App */}
              <Route
                path="/shield"
                component={props =>
                  this.props.userInfo ? (
                    <Normandy
                      authToken={this.props.accessToken}
                      urlPrefix="/shield"
                      {...props}
                    />
                  ) : (
                    <Redirect to="/" />
                  )
                }
              />

              <Route
                component={({ location }) => (
                  <div>
                    <h2>404 - Page Not Found</h2>
                    <p>
                      No delivery-console match for{' '}
                      <code>{location.pathname}</code>
                    </p>
                  </div>
                )}
              />
            </Switch>
          </Content>
        </Layout>
      </BrowserRouter>
    );
  }
}

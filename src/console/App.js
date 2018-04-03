/* @flow */

import React, { Component } from 'react';

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
} from './auth0';

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

type AppProps = {};
type AppState = {
  userInfo: any,
  accessToken: ?string,
};

class App extends Component<AppProps, AppState> {
  state = {
    userInfo: null,
    accessToken: null,
  };

  componentDidMount = () => {
    checkLogin(this.onLoggedIn);
    if (isAuthenticated()) {
      this.onLoggedIn();
    }
  };

  onUserLogin = () => {
    // Call auth0.login which will start the login redirection dance.
    login();
  };

  onLoggedIn = () => {
    fetchUserInfo(this.onUserInfo);
  };

  onUserInfo = (accessToken: string, userInfo: any) => {
    this.setState({ userInfo, accessToken });
  };

  onUserLogout = () => {
    logout();
    this.setState({ userInfo: null, accessToken: null });
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

            {(this.state.userInfo && (
              <Button onClick={this.onUserLogout}>{`Logged in as ${
                this.state.userInfo.nickname
              }`}</Button>
            )) || <Button onClick={this.onUserLogin}>Login</Button>}
          </Header>
          <Content className="app-content">
            <Switch>
              {/* Homepage */}
              <Route
                exact
                path="/"
                component={() => <Homepage userInfo={this.state.userInfo} />}
              />

              {/* Normandy App */}
              <Route
                path="/shield"
                component={props =>
                  this.state.userInfo ? (
                    <Normandy
                      authToken={this.state.accessToken}
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

export default App;

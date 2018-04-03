/* @flow */

import React, { Component } from 'react';

import 'console/App.less';

import Normandy from 'normandy/App';
import { BrowserRouter, NavLink, Link } from 'react-router-dom';
import { Route, Redirect, Switch } from 'react-router';
import { checkLogin, fetchUserInfo, isAuthenticated, login } from './auth0';

import { Alert, Button, Layout } from 'antd';
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
};

class App extends Component<AppProps, AppState> {
  state = {
    userInfo: null,
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

  onUserInfo = (userInfo: any) => {
    this.setState(userInfo);
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
              <Alert
                style={{ marginLeft: '3em' }}
                type="info"
                showIcon
                message={`You are logged.`}
              />
            )) || <Button onClick={this.onUserLogin}>Login</Button>}
          </Header>
          <Content className="app-content">
            <Switch>
              {/* Homepage */}
              <Route
                exact
                path="/"
                component={() => <Homepage authToken={this.state.userInfo} />}
              />

              {/* Normandy App */}
              <Route
                path="/shield"
                component={props =>
                  this.state.username ? (
                    <Normandy
                      authToken={this.state.userInfo}
                      urlPrefix="/shield"
                      {...props}
                    />
                  ) : (
                    <Redirect to="/login/?next=/shield" />
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

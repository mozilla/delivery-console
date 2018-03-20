/* @flow */

import React, { Component } from 'react';

import 'console/App.less';

import LoginPage from './LoginPage';
import Normandy from 'normandy/App';
import { BrowserRouter, NavLink, Link } from 'react-router-dom';
import { Route, Redirect, Switch } from 'react-router';

import { Alert, Layout } from 'antd';
const { Header, Content } = Layout;

const Homepage = props => (
  <div>
    <h3>Welcome {props.authToken ? 'back' : 'home'}!</h3>
    {props.authToken ? (
      <p>
        Go to the <Link to="/shield">SHIELD control panel</Link>.
      </p>
    ) : (
        <p>
          You are not logged in! Go to the <Link to="/login">login page</Link>.
      </p>
      )}
  </div>
);

type AppProps = {};
type AppState = {
  authToken: ?string,
  username: ?string,
};

class App extends Component<AppProps, AppState> {
  state = {
    authToken: null,
    username: null,
  };

  onUserLogin = (username: string, authToken: string) => {
    this.setState({
      username,
      authToken,
    });
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
            <NavLink to="/login">Login</NavLink>
            <NavLink to="/shield">
              SHIELD
            </NavLink>

            {this.state.username && (
              <Alert
                style={{ marginLeft: '3em' }}
                type="info"
                showIcon
                message={`You are logged in as ${this.state.username}.`}
              />
            )}
          </Header>
          <Content className="app-content">
          <Switch>
            {/* Homepage */}
            <Route
              exact
              path="/"
              component={() => <Homepage authToken={this.state.authToken} />}
            />

            {/* Login */}
            <Route
              exact
              path="/login/"
              component={() =>
                this.state.username ? (
                  <Redirect to="/" />
                ) : (
                    <LoginPage onAuth={this.onUserLogin} />
                  )
              }
            />

            {/* Normandy App */}
            <Route
              path="/shield"
              component={(props) =>
                true || this.state.username ? (
                  <Normandy
                    authToken={this.state.authToken}
                    urlPrefix="/shield"
                    {...props}
                  />
                ) : (
                    <Redirect to="/login/?next=/shield" />
                  )
              }
            />

            <Route component={({ location }) => (
              <div>
                <h2>404 - Page Not Found</h2>
                <p>No del-console match for <code>{location.pathname}</code></p>
              </div>
            )} />
          </Switch>
          </Content>
        </Layout>
      </BrowserRouter>
    );
  }
}

export default App;

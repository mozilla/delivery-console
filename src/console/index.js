/* @flow */

import React, { Component } from 'react';
import logo from './logo.svg';
import './App.css';
import LoginPage from './LoginPage';
import { BrowserRouter, Link } from 'react-router-dom';
import { Route, Redirect } from 'react-router';

type AppProps = {};
type AppState = {
  authToken: ?string,
  username: ?string,
};

const Homepage = props => (
  <div>
    <p>Welcome home!</p>
    {props.authToken ? (
      <p>
        Go to the <Link to="/normandy">Normandy page</Link>.
      </p>
    ) : (
      <p>
        Go to the <Link to="/login">login page</Link>.
      </p>
    )}
  </div>
);

const MockNormandy = props => (
  <div>Normandy with auth token {props.authToken}</div>
);

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
        <div className="App">
          <header className="App-header">
            <img src={logo} className="App-logo" alt="logo" />
            <h1 className="App-title">Welcome to Delivery Console</h1>
          </header>
          {this.state.username && (
            <div>You are logged in as {this.state.username}.</div>
          )}
          <div>
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
              exact
              path="/normandy/"
              component={() =>
                this.state.username ? (
                  <MockNormandy authToken={this.state.authToken} />
                ) : (
                  <Redirect to="/login/?next=/normandy/" />
                )
              }
            />
          </div>
        </div>
      </BrowserRouter>
    );
  }
}

export default App;

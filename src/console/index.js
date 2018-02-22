import React, { Component } from "react";
import logo from "./logo.svg";
import "./App.css";
import Normandy from "normandy/index.js";
import { BrowserRouter, Link } from "react-router-dom";
import { Route } from "react-router";

class App extends Component {
  render() {
    return (
      <BrowserRouter>
        <div className="App">
          <header className="App-header">
            <img src={logo} className="App-logo" alt="logo" />
            <h1 className="App-title">Welcome to Delivery Console</h1>
          </header>
          <div>
            <Route
              path="/"
              component={() => (
                <div>
                  <h1>Delivery Console</h1>
                  <Link to="/normandy/">Normandy</Link>
                </div>
              )}
            />
            <Route path="/normandy/" component={Normandy} />
          </div>
        </div>
      </BrowserRouter>
    );
  }
}

export default App;

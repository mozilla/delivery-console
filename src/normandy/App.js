import React, { Component } from 'react';
import logo from './logo.svg';
import './App.css';

class App extends Component {
  render() {
    return (
      <div className="App">
        <header className="App-header">
          <img src={logo} className="App-logo" alt="logo" />
          <h1 className="App-title">Welcome to Normandy</h1>
        </header>
        {this.props.authToken && (
          <div>authToken is "{this.props.authToken}"</div>
        )}
      </div>
    );
  }
}

export default App;

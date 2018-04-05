import React from 'react';
import ReactDOM from 'react-dom';
import PropTypes from 'prop-types';
import { configure, mount, shallow } from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';

require('es6-promise').polyfill();

// Configure Enzyme adapter
configure({ adapter: new Adapter() });

// localStorage mock for tests
const mockLocalStorage = () => {
  let store = {};
  return {
    getItem: function(key) {
      return store[key] || null;
    },
    removeItem: function(key) {
      delete store[key];
    },
    setItem: function(key, value) {
      store[key] = value.toString();
    },
    clear: function() {
      store = {};
    },
  };
};

// Mock component used in tests (to remove PropTypes warnings)
class Stub extends React.Component {
  static propTypes = {
    children: PropTypes.node,
    fakeProp: PropTypes.number,
  };

  render() {
    return <div>{this.props.children}</div>;
  }
}

// Globals used in testing.

global.auth0 = {
  WebAuth: jest.fn(() => ({
    authorize: jest.fn(),
    parseHash: jest.fn(),
    client: { userInfo: jest.fn() },
  })),
};
global.localStorage = mockLocalStorage();
global.Stub = Stub;
global.mount = mount;
global.shallow = shallow;
global.React = React;
global.ReactDOM = ReactDOM;

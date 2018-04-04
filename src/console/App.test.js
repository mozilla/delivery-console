import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';
import { shallow } from 'enzyme';

// Mock the localStorage API.
global.localStorage = (function() {
  var store = {};

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
})();

const webAuthMock = {
  authorize: jest.fn(),
  parseHash: jest.fn(),
  client: { userInfo: jest.fn() },
};

global.auth0 = {
  WebAuth: jest.fn(() => webAuthMock),
};

describe('delivery-console', () => {
  it('renders without crashing', () => {
    const wrapper = () => shallow(<App />);
    expect(wrapper).not.toThrow();
  });
});

import React from 'react';
import ReactDOM from 'react-dom';
import { configure, mount, shallow } from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';
import * as immutableMatchers from 'jest-immutable-matchers';
import fetchMock from 'fetch-mock';

// Configure Enzyme adapter
configure({ adapter: new Adapter() });

// Add matchers for ImmutableJS
jest.addMatchers(immutableMatchers);

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

// Globals used in testing.

global.auth0 = {
  WebAuth: jest.fn(() => ({
    authorize: jest.fn(),
    parseHash: jest.fn(),
    client: { userInfo: jest.fn() },
  })),
};
global.localStorage = mockLocalStorage();
global.mount = mount;
global.shallow = shallow;
global.React = React;
global.ReactDOM = ReactDOM;

// Set up a global fetch mock, and assert that all calls to it are expected.
beforeEach(() => {
  // Mock fetch, and don't expect any requests. All requests will be unmatched,
  // unless individual tests add more specific matches.
  fetchMock.catch({ status: 500 });
});

afterEach(() => {
  // Fail if any unmatched requests were made
  const unmatchedCalls = fetchMock.calls(false);
  expect(unmatchedCalls).toEqual([]);

  fetchMock.restore();
});

import { configure } from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';

require('es6-promise').polyfill();

// Configure Enzyme adapter
configure({ adapter: new Adapter() });

// localStorage mock for tests
const localStorageMock = (function() {
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
global.localStorage = localStorageMock;

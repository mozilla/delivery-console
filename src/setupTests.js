import { configure } from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';

require('es6-promise').polyfill();

// Configure Enzyme adapter
configure({ adapter: new Adapter() });

// localStorage mock for tests
const localStorageMock = {
  getItem: jest.fn(),
  setItem: jest.fn(),
  clear: jest.fn()
};
global.localStorage = localStorageMock

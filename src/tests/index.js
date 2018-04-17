import { configure } from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';

// require('es6-promise').polyfill();

// Configure Enzyme adapter
configure({ adapter: new Adapter() });

const testsContext = require.context('.', true, /\btest_/);
testsContext.keys().forEach(testsContext);

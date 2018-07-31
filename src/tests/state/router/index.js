/* eslint import/prefer-default-export: "off" */
import { fromJS } from 'immutable';

// This was stubbed by looking at the initial state in redux devtools
export const INITIAL_STATE = fromJS({
  location: {
    pathname: '/',
    search: '',
    hash: '',
    key: '',
  },
  action: 'POP',
});

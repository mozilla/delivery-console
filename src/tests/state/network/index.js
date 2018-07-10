/* eslint import/prefer-default-export: "off" */

import { fromJS } from 'immutable';

export const INITIAL_STATE = fromJS({
  requests: {},
  availability: {
    normandyAdmin: false,
  },
});

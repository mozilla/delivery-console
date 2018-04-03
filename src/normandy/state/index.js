import { combineReducers } from 'redux';

import app from 'normandy/state/app/reducer';

const reducer = combineReducers({
  app,
});

export default reducer;

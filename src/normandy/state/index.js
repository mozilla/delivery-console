import { combineReducers } from 'redux';

import app from 'normandy/state/app/reducer';
import { reducer as router } from 'normandy/routes';


const reducer = combineReducers({
  app,
  router,
});

export default reducer;

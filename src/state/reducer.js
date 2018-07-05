import { combineReducers } from 'redux-immutable';

import actions from 'console/state/actions/reducers';
import approvalRequests from 'console/state/approvalRequests/reducers';
import auth from 'console/state/auth/reducers';
import extensions from 'console/state/extensions/reducers';
import recipes from 'console/state/recipes/reducers';
import requests from 'console/state/requests/reducers';
import revisions from 'console/state/revisions/reducers';
import serviceInfo from 'console/state/serviceInfo/reducers';
import users from 'console/state/users/reducers';

const reducer = combineReducers({
  actions,
  approvalRequests,
  auth,
  extensions,
  recipes,
  requests,
  revisions,
  serviceInfo,
  users,
});

export default reducer;

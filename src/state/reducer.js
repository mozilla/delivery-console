import { combineReducers } from 'redux';

import actions from 'console/state/actions/reducers';
import approvalRequests from 'console/state/approvalRequests/reducers';
import auth from 'console/state/auth/reducers';
import extensions from 'console/state/extensions/reducers';
import recipes from 'console/state/recipes/reducers';
import requests from 'console/state/requests/reducers';
import revisions from 'console/state/revisions/reducers';
import serviceInfo from 'console/state/serviceInfo/reducers';
import session from 'console/state/session/reducers';
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
  session,
  users,
});

export default reducer;

import { combineReducers } from 'redux';

import actions from 'console/state/actions/reducers';
import approvalRequests from 'console/state/approvalRequests/reducers';
import extensions from 'console/state/extensions/reducers';
import recipes from 'console/state/recipes/reducers';
import requests from 'console/state/requests/reducers';
import revisions from 'console/state/revisions/reducers';
import serviceInfo from 'console/state/serviceInfo/reducers';
import session from 'console/state/session/reducers';
import users from 'console/state/users/reducers';
import console from '../console/reducers';

const reducer = combineReducers({
  actions,
  approvalRequests,
  extensions,
  recipes,
  requests,
  revisions,
  serviceInfo,
  session,
  users,
  console,
});

export default reducer;

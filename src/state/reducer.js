import { combineReducers } from 'redux';

import actions from '../normandy/state/app/actions/reducers';
import approvalRequests from '../normandy/state/app/approvalRequests/reducers';
import extensions from '../normandy/state/app/extensions/reducers';
import recipes from '../normandy/state/app/recipes/reducers';
import requests from '../normandy/state/app/requests/reducers';
import revisions from '../normandy/state/app/revisions/reducers';
import serviceInfo from '../normandy/state/app/serviceInfo/reducers';
import session from '../normandy/state/app/session/reducers';
import users from '../normandy/state/app/users/reducers';
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

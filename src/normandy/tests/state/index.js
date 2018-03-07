/* eslint import/prefer-default-export: "off" */
import { INITIAL_STATE as actions } from 'normandy/tests/state/actions';
import { INITIAL_STATE as approvalRequests } from 'normandy/tests/state/approvalRequests';
import { INITIAL_STATE as extensions } from 'normandy/tests/state/extensions';
import { INITIAL_STATE as recipes } from 'normandy/tests/state/recipes';
import { INITIAL_STATE as requests } from 'normandy/tests/state/requests';
import { INITIAL_STATE as revisions } from 'normandy/tests/state/revisions';
import { INITIAL_STATE as router } from 'normandy/tests/state/router';
import { INITIAL_STATE as serviceInfo } from 'normandy/tests/state/serviceInfo';
import { INITIAL_STATE as users } from 'normandy/tests/state/users';


export const INITIAL_STATE = {
  app: {
    actions,
    approvalRequests,
    extensions,
    recipes,
    requests,
    revisions,
    serviceInfo,
    users,
  },
  router,
};

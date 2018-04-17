/* eslint import/prefer-default-export: "off" */
import { INITIAL_STATE as actions } from 'console/tests/state/actions';
import { INITIAL_STATE as approvalRequests } from 'console/tests/state/approvalRequests';
import { INITIAL_STATE as extensions } from 'console/tests/state/extensions';
import { INITIAL_STATE as recipes } from 'console/tests/state/recipes';
import { INITIAL_STATE as requests } from 'console/tests/state/requests';
import { INITIAL_STATE as revisions } from 'console/tests/state/revisions';
import { INITIAL_STATE as router } from 'console/tests/state/router';
import { INITIAL_STATE as serviceInfo } from 'console/tests/state/serviceInfo';
import { INITIAL_STATE as users } from 'console/tests/state/users';

export const INITIAL_STATE = {
  actions,
  approvalRequests,
  extensions,
  recipes,
  requests,
  revisions,
  serviceInfo,
  users,
  router,
};

import { fromJS } from 'immutable';
import * as matchers from 'jasmine-immutable-matchers';

import {
  APPROVAL_REQUEST_RECEIVE,
  USER_RECEIVE,
} from 'normandy/state/action-types';
import approvalRequestsReducer from 'normandy/state/app/approvalRequests/reducers';
import { getApprovalRequest } from 'normandy/state/app/approvalRequests/selectors';
import usersReducer from 'normandy/state/app/users/reducers';
import { INITIAL_STATE } from 'normandy/tests/state';
import { ApprovalRequestFactory } from 'normandy/tests/state/approvalRequests';

describe('getApprovalRequest', () => {
  const approvalRequest = ApprovalRequestFactory.build();

  const STATE = {
    ...INITIAL_STATE,
    app: {
      ...INITIAL_STATE.app,
      approvalRequests: approvalRequestsReducer(undefined, {
        type: APPROVAL_REQUEST_RECEIVE,
        approvalRequest,
      }),
      users: usersReducer(undefined, {
        type: USER_RECEIVE,
        user: approvalRequest.creator,
      }),
    },
  };

  beforeEach(() => {
    jest.addMatchers(matchers);
  });

  test('should return the approval request', () => {
    expect(getApprovalRequest(STATE, approvalRequest.id)).toEqualImmutable(
      fromJS(approvalRequest),
    );
  });

  test('should return `null` for invalid ID', () => {
    expect(getApprovalRequest(STATE, 0)).toEqual(null);
  });

  test('should return default value for invalid ID with default provided', () => {
    expect(getApprovalRequest(STATE, 0, 'default')).toEqual('default');
  });
});

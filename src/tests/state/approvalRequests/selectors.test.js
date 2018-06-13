import { fromJS } from 'immutable';
import * as matchers from 'jest-immutable-matchers';

import { APPROVAL_REQUEST_RECEIVE, USER_RECEIVE } from 'console/state/action-types';
import approvalRequestsReducer from 'console/state/approvalRequests/reducers';
import { getApprovalRequest } from 'console/state/approvalRequests/selectors';
import usersReducer from 'console/state/users/reducers';
import { INITIAL_STATE } from 'console/tests/state';
import { ApprovalRequestFactory } from 'console/tests/state/approvalRequests';

describe('getApprovalRequest', () => {
  const approvalRequest = ApprovalRequestFactory.build();

  const STATE = {
    ...INITIAL_STATE,
    approvalRequests: approvalRequestsReducer(undefined, {
      type: APPROVAL_REQUEST_RECEIVE,
      approvalRequest,
    }),
    users: usersReducer(undefined, {
      type: USER_RECEIVE,
      user: approvalRequest.creator,
    }),
  };

  beforeEach(() => {
    jest.addMatchers(matchers);
  });

  it('should return the approval request', () => {
    expect(getApprovalRequest(STATE, approvalRequest.id)).toEqualImmutable(
      fromJS(approvalRequest),
    );
  });

  it('should return `null` for invalid ID', () => {
    expect(getApprovalRequest(STATE, 0)).toEqual(null);
  });

  it('should return default value for invalid ID with default provided', () => {
    expect(getApprovalRequest(STATE, 0, 'default')).toEqual('default');
  });
});

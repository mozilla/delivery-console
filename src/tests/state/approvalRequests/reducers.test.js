import { fromJS, Map } from 'immutable';
import * as matchers from 'jest-immutable-matchers';

import {
  APPROVAL_REQUEST_DELETE,
  APPROVAL_REQUEST_RECEIVE,
  RECIPE_HISTORY_RECEIVE,
} from 'console/state/action-types';
import approvalRequestsReducer from 'console/state/approvalRequests/reducers';
import { INITIAL_STATE, ApprovalRequestFactory } from 'console/tests/state/approvalRequests';

describe('Approval requests reducer', () => {
  const approvalRequest = ApprovalRequestFactory.build();

  beforeEach(() => {
    jest.addMatchers(matchers);
  });

  it('should return initial state by default', () => {
    expect(approvalRequestsReducer(undefined, { type: 'INITIAL' })).toEqual(INITIAL_STATE);
  });

  it('should handle APPROVAL_REQUEST_RECEIVE', () => {
    const reducedApprovalRequest = {
      ...approvalRequest,
      approver_id: approvalRequest.approver ? approvalRequest.approver.id : null,
      creator_id: approvalRequest.creator.id,
    };

    delete reducedApprovalRequest.approver;
    delete reducedApprovalRequest.creator;

    const updatedState = approvalRequestsReducer(undefined, {
      type: APPROVAL_REQUEST_RECEIVE,
      approvalRequest,
    });

    expect(updatedState).toEqualImmutable(
      INITIAL_STATE.setIn(['items', approvalRequest.id], fromJS(reducedApprovalRequest)),
    );
  });

  it('should handle APPROVAL_REQUEST_DELETE', () => {
    const state = approvalRequestsReducer(undefined, {
      type: APPROVAL_REQUEST_RECEIVE,
      approvalRequest,
    });

    const updatedState = approvalRequestsReducer(state, {
      type: APPROVAL_REQUEST_DELETE,
      approvalRequestId: approvalRequest.id,
    });

    expect(updatedState).toEqual(INITIAL_STATE);
  });

  it('should handle RECIPE_HISTORY_RECEIVE', () => {
    const appRequest = {
      id: 'test',
      arbitrary_data: 123,
    };

    const state = approvalRequestsReducer(undefined, {
      type: RECIPE_HISTORY_RECEIVE,
      revisions: [
        {
          approval_request: appRequest,
        },
      ],
    });

    expect(state.getIn(['items', appRequest.id])).toEqual(new Map(appRequest));
  });
});

import {
  APPROVAL_REQUEST_DELETE,
  APPROVAL_REQUEST_RECEIVE,
  USER_RECEIVE,
} from 'console/state/action-types';

import { makeApiRequest, makeNormandyApiRequest } from 'console/state/network/actions';

export function approvalRequestReceived(approvalRequest) {
  return dispatch => {
    dispatch({
      type: APPROVAL_REQUEST_RECEIVE,
      approvalRequest,
    });

    dispatch({
      type: USER_RECEIVE,
      user: approvalRequest.creator,
    });

    if (approvalRequest.approver) {
      dispatch({
        type: USER_RECEIVE,
        user: approvalRequest.approver,
      });
    }
  };
}

export function fetchApprovalRequest(pk) {
  return async dispatch => {
    const requestId = `fetch-approval-request-${pk}`;
    const response = dispatch(makeNormandyApiRequest(requestId, `v3/approval_request/${pk}/`));
    const approvalRequest = await response;

    dispatch(approvalRequestReceived(approvalRequest));
  };
}

export function fetchAllApprovalRequests() {
  return async dispatch => {
    const requestId = 'fetch-all-approval-requests';
    let response = await dispatch(makeNormandyApiRequest(requestId, 'v3/approval_request/'));
    let approvalRequests = response.results;

    while (approvalRequests) {
      approvalRequests.forEach(approvalRequest => {
        dispatch(approvalRequestReceived(approvalRequest));
      });

      if (response.next) {
        response = await dispatch(makeApiRequest(requestId, response.next));
        approvalRequests = response.results;
      } else {
        approvalRequests = null;
      }
    }
  };
}

export function approveApprovalRequest(pk, data) {
  return async dispatch => {
    const requestId = `approve-approval-request-${pk}`;
    const approvalRequest = await dispatch(
      makeNormandyApiRequest(requestId, `v3/approval_request/${pk}/approve/`, {
        method: 'POST',
        data,
      }),
    );

    dispatch(approvalRequestReceived(approvalRequest));
  };
}

export function rejectApprovalRequest(pk, data) {
  return async dispatch => {
    const requestId = `reject-approval-request-${pk}`;
    const approvalRequest = await dispatch(
      makeNormandyApiRequest(requestId, `v3/approval_request/${pk}/reject/`, {
        method: 'POST',
        data,
      }),
    );

    dispatch(approvalRequestReceived(approvalRequest));
  };
}

export function closeApprovalRequest(pk) {
  return async dispatch => {
    const requestId = `close-approval-request-${pk}`;

    await dispatch(
      makeNormandyApiRequest(requestId, `v3/approval_request/${pk}/close/`, {
        method: 'POST',
      }),
    );

    dispatch({
      type: APPROVAL_REQUEST_DELETE,
      approvalRequestId: pk,
    });
  };
}

import {
  ACTION_RECEIVE,
  APPROVAL_REQUEST_CREATE,
  REVISION_RECEIVE,
  USER_RECEIVE,
} from 'console/state/action-types';
import { approvalRequestReceived } from 'console/state/approvalRequests/actions';
import { makeApiRequest, makeNormandyApiRequest } from 'console/state/network/actions';

export function revisionReceived(revision) {
  return dispatch => {
    dispatch({
      type: REVISION_RECEIVE,
      revision,
    });

    dispatch({
      type: ACTION_RECEIVE,
      action: revision.action,
    });

    if (revision.approval_request) {
      dispatch(approvalRequestReceived(revision.approval_request));
    }

    if (revision.user) {
      dispatch({
        type: USER_RECEIVE,
        user: revision.user,
      });
    }
  };
}

export function fetchRevision(pk) {
  return async dispatch => {
    const requestId = `fetch-revision-${pk}`;
    const revision = await dispatch(
      makeNormandyApiRequest(requestId, `v3/recipe_revision/${pk}/`),
    );
    dispatch(revisionReceived(revision));
  };
}

export function fetchAllRevisions() {
  return async dispatch => {
    const requestId = 'fetch-all-revisions';
    let response = await dispatch(makeNormandyApiRequest(requestId, 'v3/recipe_revision/'));
    let revisions = response.results;

    while (revisions) {
      revisions.forEach(revision => {
        dispatch({
          type: REVISION_RECEIVE,
          revision,
        });
      });

      if (response.next) {
        response = await dispatch(makeApiRequest(requestId, response.next));
        revisions = response.results;
      } else {
        revisions = null;
      }
    }
  };
}

export function requestRevisionApproval(pk) {
  return async dispatch => {
    const requestId = `request-revision-approval-${pk}`;
    const approvalRequest = await dispatch(
      makeNormandyApiRequest(requestId, `v3/recipe_revision/${pk}/request_approval/`, {
        method: 'POST',
      }),
    );

    dispatch(approvalRequestReceived(approvalRequest));

    dispatch({
      type: APPROVAL_REQUEST_CREATE,
      revisionId: pk,
      approvalRequest,
    });
  };
}

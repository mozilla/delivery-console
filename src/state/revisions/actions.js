import {
  ACTION_RECEIVE,
  APPROVAL_REQUEST_CREATE,
  REVISION_RECEIVE,
  USER_RECEIVE,
} from 'console/state/action-types';
import { approvalRequestReceived } from 'console/state/approvalRequests/actions';
import { makeNormandyApiRequest } from 'console/state/requests/actions';

export function revisionReceived(revision) {
  return dispatch => {
    dispatch({
      type: REVISION_RECEIVE,
      revision,
    });

    dispatch({
      type: ACTION_RECEIVE,
      action: revision.recipe.action,
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
      makeNormandyApiRequest(requestId, `v2/recipe_revision/${pk}/`),
    );
    dispatch(revisionReceived(revision));
  };
}

export function fetchAllRevisions() {
  return async dispatch => {
    const requestId = 'fetch-all-revisions';
    const revisions = await dispatch(
      makeNormandyApiRequest(requestId, 'v2/recipe_revision/'),
    );

    revisions.forEach(revision => {
      dispatch(revisionReceived(revision));
    });
  };
}

export function requestRevisionApproval(pk) {
  return async dispatch => {
    const requestId = `request-revision-approval-${pk}`;
    const approvalRequest = await dispatch(
      makeNormandyApiRequest(
        requestId,
        `v2/recipe_revision/${pk}/request_approval/`,
        {
          method: 'POST',
        },
      ),
    );

    dispatch(approvalRequestReceived(approvalRequest));

    dispatch({
      type: APPROVAL_REQUEST_CREATE,
      revisionId: pk,
      approvalRequest,
    });
  };
}

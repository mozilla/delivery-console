import { fromJS, Map } from 'immutable';
import { combineReducers } from 'redux-immutable';

import {
  APPROVAL_REQUEST_DELETE,
  APPROVAL_REQUEST_RECEIVE,
  RECIPE_HISTORY_RECEIVE,
} from 'console/state/action-types';

function formatApprovalRequest(approvalRequest) {
  return approvalRequest.withMutations(mutableApprovalRequest =>
    mutableApprovalRequest
      .set('creator_id', approvalRequest.getIn(['creator', 'id'], null))
      .remove('creator')
      .set('approver_id', approvalRequest.getIn(['approver', 'id'], null))
      .remove('approver'),
  );
}

function items(state = new Map(), action) {
  let approvalRequest;

  switch (action.type) {
    case APPROVAL_REQUEST_RECEIVE:
      approvalRequest = formatApprovalRequest(fromJS(action.approvalRequest));
      return state.set(action.approvalRequest.id, approvalRequest);

    case RECIPE_HISTORY_RECEIVE: {
      const revisions = fromJS(action.revisions);

      return state.withMutations(mutableState => {
        revisions.forEach(revision => {
          const approvalId = revision.getIn(['approval_request', 'id'], null);
          if (approvalId) {
            mutableState.set(approvalId, formatApprovalRequest(revision.get('approval_request')));
          }
        });
      });
    }

    case APPROVAL_REQUEST_DELETE:
      return state.remove(action.approvalRequestId);

    default:
      return state;
  }
}

export default combineReducers({
  items,
});

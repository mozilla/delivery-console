import { toDate } from 'date-fns/esm';
import { differenceInMilliseconds } from 'date-fns/esm';
import { Map } from 'immutable';

import { getAction } from 'console/state/actions/selectors';
import { getApprovalRequest } from 'console/state/approvalRequests/selectors';
import {
  REVISION_APPROVED,
  REVISION_DISABLED,
  REVISION_DRAFT,
  REVISION_LIVE,
  REVISION_OUTDATED,
  REVISION_PENDING_APPROVAL,
  REVISION_REJECTED,
} from 'console/state/constants';
import {
  getApprovedRevisionForRecipe,
  getApprovedRevisionIdForRecipe,
  getLatestRevisionIdForRecipe,
  isRecipeEnabled,
} from 'console/state/recipes/selectors';
import { getUser } from 'console/state/users/selectors';

export function getRevision(state, id, defaultsTo = null) {
  const revision = state.getIn(['revisions', 'items', id]);

  if (revision) {
    const action = getAction(state, revision.getIn(['recipe', 'action_id']));
    const approvalRequest = getApprovalRequest(state, revision.get('approval_request_id'));
    const user = getUser(state, revision.get('user_id'));

    return revision
      .setIn(['recipe', 'action'], action)
      .removeIn(['recipe', 'action_id'])
      .set('approval_request', approvalRequest)
      .remove('approval_request_id')
      .set('user', user)
      .remove('user_id');
  }

  return defaultsTo;
}

export function getRecipeForRevision(state, id, defaultsTo = null) {
  const revision = getRevision(state, id, new Map());
  return revision.get('recipe', defaultsTo);
}

export function getRecipeIdForRevision(state, id, defaultsTo = null) {
  const recipe = getRecipeForRevision(state, id, new Map());
  return recipe.get('id', defaultsTo);
}

export function isLatestRevision(state, id) {
  const recipeId = getRecipeIdForRevision(state, id);
  const latestRevisionId = getLatestRevisionIdForRecipe(state, recipeId);
  return latestRevisionId === id;
}

export function isLiveRevision(state, id) {
  const revision = getRevision(state, id, new Map());
  const isEnabled = isRecipeEnabled(state, revision.getIn(['recipe', 'id']));
  return isEnabled && isLatestApprovedRevision(state, id);
}

export function isApprovedRevision(state, id) {
  const revision = getRevision(state, id, new Map());
  return revision.getIn(['approval_request', 'approved']) === true;
}

export function isRejectedRevision(state, id) {
  const revision = getRevision(state, id, new Map());
  return revision.getIn(['approval_request', 'approved']) === false;
}

export function isRevisionPendingApproval(state, id) {
  const revision = getRevision(state, id, new Map());
  return revision.getIn(['approval_request', 'approved']) === null;
}

export function isLatestApprovedRevision(state, id) {
  const recipeId = getRecipeIdForRevision(state, id);
  const approvedRevisionId = getApprovedRevisionIdForRecipe(state, recipeId);
  return approvedRevisionId === id;
}

export function revisionHasApprovalRequest(state, id) {
  const revision = getRevision(state, id, new Map());
  return revision.get('approval_request', null) !== null;
}

export function isApprovableRevision(state, id) {
  return isLatestRevision(state, id) && !revisionHasApprovalRequest(state, id);
}

export function isDisabledRevision(state, id) {
  const isLatest = isLatestRevision(state, id);
  const isApproved = isApprovedRevision(state, id);
  const isLatestApproved = isLatestApprovedRevision(state, id);
  return isLatest && isApproved && !isLatestApproved;
}

export function getRevisionStatus(state, id) {
  if (isLiveRevision(state, id)) {
    return REVISION_LIVE;
  } else if (isDisabledRevision(state, id)) {
    return REVISION_DISABLED;
  } else if (isApprovedRevision(state, id)) {
    return REVISION_APPROVED;
  } else if (isRejectedRevision(state, id)) {
    return REVISION_REJECTED;
  } else if (isRevisionPendingApproval(state, id)) {
    return REVISION_PENDING_APPROVAL;
  }
  return null;
}

export function getRevisionDraftStatus(state, id) {
  const recipeId = getRecipeIdForRevision(state, id);
  const approvedRevision = getApprovedRevisionForRecipe(state, recipeId);
  const revision = getRevision(state, id);

  if (approvedRevision) {
    const revisionDate = toDate(revision.get('date_created'));
    const approvedRevisionDate = toDate(approvedRevision.get('date_created'));
    const delta = differenceInMilliseconds(approvedRevisionDate, revisionDate);

    if (delta < 0) {
      return REVISION_DRAFT;
    } else if (delta > 0) {
      return REVISION_OUTDATED;
    }
  } else {
    return REVISION_DRAFT;
  }

  return null;
}

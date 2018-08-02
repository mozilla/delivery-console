import { fromJS } from 'immutable';

import { ACTION_RECEIVE, REVISION_RECEIVE, USER_RECEIVE } from 'console/state/action-types';
import actionsReducer from 'console/state/actions/reducers';
import revisionsReducer from 'console/state/revisions/reducers';
import usersReducer from 'console/state/users/reducers';
import { getRevision } from 'console/state/revisions/selectors';
import { INITIAL_STATE } from 'console/tests/state';
import { RevisionFactory } from 'console/tests/state/revisions';

describe('getRevision', () => {
  const revision = RevisionFactory.build();

  const STATE = INITIAL_STATE.merge(
    fromJS({
      actions: actionsReducer(undefined, {
        type: ACTION_RECEIVE,
        action: revision.recipe.action,
      }),
      revisions: revisionsReducer(undefined, {
        type: REVISION_RECEIVE,
        revision,
      }),
      users: usersReducer(undefined, {
        type: USER_RECEIVE,
        user: revision.user,
      }),
    }),
  );

  it('should return the revision', () => {
    expect(getRevision(STATE, revision.id)).toEqualImmutable(fromJS(revision));
  });

  it('should return `null` for invalid ID', () => {
    expect(getRevision(STATE, 'invalid')).toEqual(null);
  });

  it('should return default value for invalid ID with default provided', () => {
    expect(getRevision(STATE, 'invalid', 'default')).toEqual('default');
  });
});

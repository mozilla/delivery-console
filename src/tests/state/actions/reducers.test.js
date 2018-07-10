import { fromJS } from 'immutable';

import { ACTION_RECEIVE } from 'console/state/action-types';
import actionsReducer from 'console/state/actions/reducers';
import { INITIAL_STATE, ActionFactory } from 'console/tests/state/actions';

describe('Actions reducer', () => {
  it('should return initial state by default', () => {
    expect(actionsReducer(undefined, { type: 'INITIAL' })).toEqual(INITIAL_STATE);
  });

  it('should handle ACTION_RECEIVE', () => {
    const action = ActionFactory.build();
    const updatedState = actionsReducer(undefined, {
      type: ACTION_RECEIVE,
      action,
    });
    expect(updatedState).toEqual(INITIAL_STATE.setIn(['items', action.id], fromJS(action)));
  });
});

import { fromJS } from 'immutable';

import { ACTION_RECEIVE } from 'console/state/action-types';
import actionsReducer from 'console/state/actions/reducers';
import { INITIAL_STATE, ActionFactory } from 'console/tests/state/actions';

describe('Actions reducer', () => {
  it('should return initial state by default', () => {
    expect(actionsReducer(undefined, { type: 'INITIAL' })).toEqual(
      INITIAL_STATE,
    );
  });

  it('should handle ACTION_RECEIVE', () => {
    const action = ActionFactory.build();

    expect(
      actionsReducer(undefined, {
        type: ACTION_RECEIVE,
        action,
      }),
    ).toEqual({
      ...INITIAL_STATE,
      items: INITIAL_STATE.items.set(action.id, fromJS(action)),
    });
  });
});

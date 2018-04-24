import { fromJS } from 'immutable';

import { getAction } from 'console/state/actions/selectors';
import { INITIAL_STATE } from 'console/tests/state';
import { ActionFactory } from 'console/tests/state/actions';

describe('getAction', () => {
  const action = ActionFactory.build();

  const STATE = {
    ...INITIAL_STATE,
    actions: {
      ...INITIAL_STATE.actions,
      items: INITIAL_STATE.actions.items.set(action.id, fromJS(action)),
    },
  };

  it('should return the action', () => {
    expect(getAction(STATE, action.id)).toEqual(fromJS(action));
  });

  it('should return `null` for invalid ID', () => {
    expect(getAction(STATE, 0)).toEqual(null);
  });

  it('should return default value for invalid ID with default provided', () => {
    expect(getAction(STATE, 0, 'default')).toEqual('default');
  });
});

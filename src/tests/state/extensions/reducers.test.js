import { fromJS } from 'immutable';

import { EXTENSION_RECEIVE } from 'console/state/action-types';
import extensionsReducer from 'console/state/extensions/reducers';
import { INITIAL_STATE, ExtensionFactory } from 'console/tests/state/extensions';

describe('Extensions reducer', () => {
  const extension = ExtensionFactory.build();

  it('should return initial state by default', () => {
    expect(extensionsReducer(undefined, { type: 'INITIAL' })).toEqual(INITIAL_STATE);
  });

  it('should handle EXTENSION_RECEIVE', () => {
    const updatedState = extensionsReducer(undefined, {
      type: EXTENSION_RECEIVE,
      extension,
    });

    expect(updatedState).toEqual(INITIAL_STATE.setIn(['items', extension.id], fromJS(extension)));
  });
});

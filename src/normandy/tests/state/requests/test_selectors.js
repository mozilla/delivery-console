import * as matchers from 'jasmine-immutable-matchers';

import { DEFAULT_REQUEST } from 'normandy/state/constants';
import { getRequest } from 'normandy/state/app/requests/selectors';
import { INITIAL_STATE } from 'normandy/tests/state';

describe('getRequest', () => {
  const REQUEST = DEFAULT_REQUEST.set('inProgress', true);
  const STATE = {
    ...INITIAL_STATE,
    app: {
      ...INITIAL_STATE.app,
      requests: INITIAL_STATE.app.requests.set('test', REQUEST),
    },
  };

  beforeEach(() => {
    this.addMatchers(matchers);
  });

  test('should return the request', () => {
    expect(getRequest(STATE, 'test')).toEqualImmutable(REQUEST);
  });

  test('should return the DEFAULT_REQUEST object for invalid ID', () => {
    expect(getRequest(STATE, 'invalid')).toEqualImmutable(DEFAULT_REQUEST);
  });

  test('should return default value for invalid ID with default provided', () => {
    expect(getRequest(STATE, 'invalid', 'default')).toEqual('default');
  });
});

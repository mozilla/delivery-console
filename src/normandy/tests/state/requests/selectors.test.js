import * as matchers from 'jest-immutable-matchers';

import { DEFAULT_REQUEST } from 'normandy/state/constants';
import { getRequest } from 'normandy/state/app/requests/selectors';
import { INITIAL_STATE } from 'normandy/tests/state';

describe('getRequest', () => {
  const REQUEST = DEFAULT_REQUEST.set('inProgress', true);
  const STATE = {
    ...INITIAL_STATE,
    requests: INITIAL_STATE.requests.set('test', REQUEST),
  };

  beforeEach(() => {
    jest.addMatchers(matchers);
  });

  it('should return the request', () => {
    expect(getRequest(STATE, 'test')).toEqualImmutable(REQUEST);
  });

  it('should return the DEFAULT_REQUEST object for invalid ID', () => {
    expect(getRequest(STATE, 'invalid')).toEqualImmutable(DEFAULT_REQUEST);
  });

  it('should return default value for invalid ID with default provided', () => {
    expect(getRequest(STATE, 'invalid', 'default')).toEqual('default');
  });
});

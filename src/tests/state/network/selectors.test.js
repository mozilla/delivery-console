import { DEFAULT_REQUEST } from 'console/state/constants';
import { getRequest, isNormandyAdminAvailable } from 'console/state/network/selectors';
import { INITIAL_STATE } from 'console/tests/state';

describe('getRequest', () => {
  const REQUEST = DEFAULT_REQUEST.set('inProgress', true);
  const STATE = INITIAL_STATE.setIn(['network', 'requests', 'test'], REQUEST);

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

describe('isNormandyAdminAvailable', () => {
  it('should return the availability', () => {
    expect(
      isNormandyAdminAvailable(
        INITIAL_STATE.setIn(['network', 'availability', 'normandyAdmin'], false),
      ),
    ).toEqual(false);
    expect(
      isNormandyAdminAvailable(
        INITIAL_STATE.setIn(['network', 'availability', 'normandyAdmin'], true),
      ),
    ).toEqual(true);
  });
});

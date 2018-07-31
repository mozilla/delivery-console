import { Map } from 'immutable';
import * as immutableMatchers from 'jest-immutable-matchers';

import {
  REQUEST_FAILURE,
  REQUEST_SEND,
  REQUEST_SUCCESS,
  NETWORK_NORMANDY_ADMIN_AVAILABLE,
} from 'console/state/action-types';
import { DEFAULT_REQUEST } from 'console/state/constants';
import networkReducer from 'console/state/network/reducers';
import { INITIAL_STATE } from 'console/tests/state/network';

describe('Network reducer', () => {
  beforeEach(() => {
    jest.addMatchers(immutableMatchers);
  });

  describe('Requests reducer', () => {
    it('should return initial state by default', () => {
      expect(networkReducer(undefined, { type: 'INITIAL' })).toEqual(INITIAL_STATE);
    });

    it('should handle REQUEST_SEND', () => {
      expect(
        networkReducer(undefined, {
          type: REQUEST_SEND,
          requestId: 'test',
        }),
      ).toEqualImmutable(
        INITIAL_STATE.setIn(['requests', 'test'], DEFAULT_REQUEST.set('inProgress', true)),
      );
    });

    it('should handle REQUEST_SUCCESS', () => {
      expect(
        networkReducer(undefined, {
          type: REQUEST_SUCCESS,
          requestId: 'test',
        }),
      ).toEqualImmutable(INITIAL_STATE.setIn(['requests', 'test'], DEFAULT_REQUEST));
    });

    const ERROR = { message: 'test message' };

    it('should handle REQUEST_FAILURE', () => {
      expect(
        networkReducer(undefined, {
          type: REQUEST_FAILURE,
          error: ERROR,
          requestId: 'test',
        }),
      ).toEqualImmutable(
        INITIAL_STATE.setIn(['requests', 'test'], DEFAULT_REQUEST.set('error', new Map(ERROR))),
      );
    });
  });

  describe('availability reducer', () => {
    it('should handle NETWORK_NORMANDY_AVAILABLE', () => {
      expect(
        networkReducer(undefined, {
          type: NETWORK_NORMANDY_ADMIN_AVAILABLE,
          available: true,
        }),
      ).toEqual(INITIAL_STATE.setIn(['availability', 'normandyAdmin'], true));

      expect(
        networkReducer(undefined, {
          type: NETWORK_NORMANDY_ADMIN_AVAILABLE,
          available: false,
        }),
      ).toEqual(INITIAL_STATE.setIn(['availability', 'normandyAdmin'], false));
    });
  });
});

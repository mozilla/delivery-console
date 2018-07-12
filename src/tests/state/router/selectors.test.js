import { LOCATION_CHANGE } from 'connected-react-router/lib/actions';
import { fromJS } from 'immutable';
import * as matchers from 'jest-immutable-matchers';

import {
  getCurrentPathname,
  getCurrentRoute,
  getCurrentRouteTree,
  getCurrentUrlAsObject,
  getQueryParam,
  getQueryParamAsInt,
  getUrlParam,
  getUrlParamAsInt,
} from 'console/state/router/selectors';
import { rootReducer } from 'console/tests/mockStore';
import { reduceUrlsToRoutesList } from 'console/utils/router';
import * as consoleUrls from 'console/urls';

const originalConsoleUrls = consoleUrls.default;

let STATE = rootReducer(undefined, {
  type: LOCATION_CHANGE,
  payload: {
    location: {
      pathname: '/test/123/',
      search: '?status=456',
      hash: '',
      key: '',
    },
    action: 'PUSH',
  },
});

beforeAll(() => {
  // Mock URL routing
  consoleUrls.default = reduceUrlsToRoutesList({
    '/': {
      name: 'home',
      component: null,
      routes: {
        '/test': {
          name: 'test-listing',
          component: null,
          routes: {
            '/:testId': {
              name: 'test-details',
              component: null,
            },
          },
        },
      },
    },
  });
});

afterAll(() => {
  // Clean up mocked URLs
  consoleUrls.default = originalConsoleUrls;
});

describe('getCurrentPathname', () => {
  it('should return the current pathname', () => {
    expect(getCurrentPathname(STATE)).toEqual('/test/123/');
  });
});

describe('getCurrentRoute', () => {
  it('should return the current route', () => {
    const route = getCurrentRoute(STATE);
    expect(route).toEqual({
      component: null,
      exact: true,
      name: 'test-details',
      parentPath: '/test/',
      path: '/test/:testId/',
    });
  });
});

describe('getCurrentRouteTree', () => {
  beforeEach(() => {
    jest.addMatchers(matchers);
  });

  it('should return the current route tree', () => {
    const routeTree = getCurrentRouteTree(STATE);
    expect(routeTree).toEqualImmutable(
      fromJS([
        {
          component: null,
          exact: true,
          name: 'test-details',
          parentPath: '/test/',
          path: '/test/:testId/',
          pathname: '/test/123/',
        },
        {
          component: null,
          exact: true,
          name: 'test-listing',
          parentPath: '/',
          path: '/test/',
          pathname: '/test/',
        },
        {
          component: null,
          exact: true,
          name: 'home',
          parentPath: null,
          path: '/',
          pathname: '/',
        },
      ]),
    );
  });
});

describe('getUrlParam', () => {
  it('should return the URL param correctly', () => {
    expect(getUrlParam(STATE, 'testId')).toBe('123');
  });
});

describe('getUrlParamAsInt', () => {
  it('should return the URL param as an int', () => {
    expect(getUrlParamAsInt(STATE, 'testId')).toBe(123);
  });
});

describe('getQueryParam', () => {
  it('should return the URL param correctly', () => {
    expect(getQueryParam(STATE, 'status')).toBe('456');
  });
});

describe('getQueryParamAsInt', () => {
  it('should return the URL param as an int', () => {
    expect(getQueryParamAsInt(STATE, 'status')).toBe(456);
  });
});

describe('getCurrentUrlAsObject', () => {
  it('should return the current URL as an object', () => {
    expect(getCurrentUrlAsObject(STATE)).toEqual({
      pathname: '/test/123/',
      search: '?status=456',
    });
  });

  it('should update query params correctly', () => {
    expect(getCurrentUrlAsObject(STATE, { status: 9, next: 10 })).toEqual({
      pathname: '/test/123/',
      search: '?status=9&next=10',
    });
  });
});

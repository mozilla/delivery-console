import { LOCATION_CHANGE } from 'connected-react-router/lib/actions';
import { fromJS } from 'immutable';

import {
  getCurrentDocumentTitle,
  getCurrentPathname,
  getCurrentRoute,
  getCurrentRouteTree,
  getCurrentUrlAsObject,
  getRevisionFromUrl,
  getQueryParam,
  getQueryParamAsInt,
  getUrlParam,
  getUrlParamAsInt,
} from 'console/state/router/selectors';
import { rootReducer } from 'console/tests/mockStore';
import { reduceUrlsToRoutesList } from 'console/utils/router';
import * as consoleUrls from 'console/urls';
import { getRevision } from '../../../state/revisions/selectors';

const originalConsoleUrls = consoleUrls.default;

let STATE = rootReducer(undefined, {
  type: LOCATION_CHANGE,
  payload: {
    location: {
      pathname: '/test/a/123/',
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
            '/a/:testId': {
              name: 'test-details',
              component: null,
            },
            '/b/:testId': {
              name: 'test-details',
              component: null,
              documentTitle: 'plain string',
            },
            '/c/:testId': {
              name: 'test-details',
              component: null,
              documentTitle: ['an', 'array'],
            },
            '/d/:testId': {
              name: 'test-details',
              component: null,
              documentTitle: () => 'function of state',
            },
            '/e/:testId': {
              name: 'test-details',
              component: null,
              documentTitle: () => ['function', 'of', 'state'],
            },
          },
        },
        '/recipe/:recipeId': {
          name: 'revision-details',
          component: null,
          routes: {
            '/revision/:revisionId': {
              name: 'revision-details',
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
    expect(getCurrentPathname(STATE)).toEqual('/test/a/123/');
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
      path: '/test/a/:testId/',
    });
  });
});

describe('getCurrentRouteTree', () => {
  it('should return the current route tree', () => {
    const routeTree = getCurrentRouteTree(STATE);
    expect(routeTree).toEqualImmutable(
      fromJS([
        {
          component: null,
          exact: true,
          name: 'test-details',
          parentPath: '/test/',
          path: '/test/a/:testId/',
          pathname: '/test/a/123/',
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
      pathname: '/test/a/123/',
      search: '?status=456',
    });
  });

  it('should update query params correctly', () => {
    expect(getCurrentUrlAsObject(STATE, { status: 9, next: 10 })).toEqual({
      pathname: '/test/a/123/',
      search: '?status=9&next=10',
    });
  });
});

describe('getRevisionFromUrl', () => {
  it('should fetch the revision from the state', () => {
    let mockState = STATE;
    mockState = rootReducer(mockState, {
      type: LOCATION_CHANGE,
      payload: {
        location: { pathname: '/recipe/1/revision/2/' },
        action: 'PUSH',
      },
    });
    mockState = rootReducer(mockState, { type: 'REVISION_RECEIVE', revision: { id: 2 } });
    expect(getRevisionFromUrl(mockState)).toEqual(getRevision(mockState, 2));
    expect(getRevisionFromUrl(mockState).get('id')).toEqual(2);
  });

  it('return the latest revision if one is not specified in the url', () => {
    let mockState = STATE;
    mockState = rootReducer(mockState, {
      type: LOCATION_CHANGE,
      payload: {
        location: {
          pathname: '/recipe/1/',
          search: '',
          hash: '',
          key: '',
        },
        action: 'PUSH',
      },
    });
    const revision = { id: 2 };
    mockState = rootReducer(mockState, {
      type: 'RECIPE_RECEIVE',
      recipe: { id: 1, latest_revision: revision },
    });
    mockState = rootReducer(mockState, { type: 'REVISION_RECEIVE', revision });
    expect(getRevisionFromUrl(mockState, 'DEFAULT')).toEqual(getRevision(mockState, 2));
    expect(getRevisionFromUrl(mockState).get('id')).toEqual(2);
  });

  it('return the default if no recipe is in the url', () => {
    expect(getRevisionFromUrl(STATE, 'DEFAULT')).toEqual('DEFAULT');
  });

  it('should return the default when the revision from the url does not exist', () => {
    let mockState = STATE;
    mockState = rootReducer(mockState, {
      type: LOCATION_CHANGE,
      payload: {
        location: { pathname: '/recipe/1/revision/2/' },
        action: 'PUSH',
      },
    });
    expect(getRevisionFromUrl(mockState, 'DEFAULT')).toEqual('DEFAULT');
  });
});

describe('getCurrentDocumentTitle', () => {
  it('should return the default when there is no title set', () => {
    expect(getCurrentDocumentTitle(STATE, 'Site Name')).toEqual('Site Name');
  });

  it('should prepend a plain string', () => {
    let mockState = STATE;
    mockState = rootReducer(mockState, {
      type: LOCATION_CHANGE,
      payload: {
        location: { pathname: '/test/b/123/' },
        action: 'PUSH',
      },
    });
    expect(getCurrentDocumentTitle(mockState, 'Site Name')).toEqual('plain string • Site Name');
  });

  it('should join arrays', () => {
    let mockState = STATE;
    mockState = rootReducer(mockState, {
      type: LOCATION_CHANGE,
      payload: {
        location: { pathname: '/test/c/123/' },
        action: 'PUSH',
      },
    });
    expect(getCurrentDocumentTitle(mockState, 'Site Name')).toEqual('an • array • Site Name');
  });

  it('should call functions', () => {
    let mockState = STATE;
    mockState = rootReducer(mockState, {
      type: LOCATION_CHANGE,
      payload: {
        location: { pathname: '/test/d/123/' },
        action: 'PUSH',
      },
    });
    expect(getCurrentDocumentTitle(mockState, 'Site Name')).toEqual(
      'function of state • Site Name',
    );
  });

  it('should join arrays', () => {
    let mockState = STATE;
    mockState = rootReducer(mockState, {
      type: LOCATION_CHANGE,
      payload: {
        location: { pathname: '/test/e/123/' },
        action: 'PUSH',
      },
    });
    expect(getCurrentDocumentTitle(mockState, 'Site Name')).toEqual(
      'function • of • state • Site Name',
    );
  });

  it('should make default required', () => {
    expect(() => getCurrentDocumentTitle(STATE)).toThrow(/defaultsTo is required/);
  });
});

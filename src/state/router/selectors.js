import { fromJS, List, Map } from 'immutable';
import { matchRoutes } from 'react-router-config';

import applicationRoutes from 'console/urls';
import { replaceParamsInPath } from 'console/utils/router';
import { getLatestRevisionIdForRecipe } from 'console/state/recipes/selectors';
import { getRevision } from 'console/state/revisions/selectors';

function getRouteByPath(path) {
  return applicationRoutes.find(route => route.path === path);
}

function getRouteMatchByPathname(pathname) {
  const route = matchRoutes(applicationRoutes, pathname)[0];
  return route;
}

export function getCurrentPathname(state, defaultsTo = null) {
  return state.getIn(['router', 'location', 'pathname'], defaultsTo);
}

export function getCurrentRoute(state, defaultsTo = null) {
  const routeMatch = getRouteMatchByPathname(getCurrentPathname(state));
  return routeMatch.route || defaultsTo;
}

export function getCurrentRouteTree(state) {
  let pathname = getCurrentPathname(state);
  const routeMatch = getRouteMatchByPathname(pathname);

  if (!routeMatch) {
    return new List();
  }

  let route = fromJS({
    ...routeMatch.route,
    pathname,
  });

  let routes = new List([route]);

  while (route.get('parentPath')) {
    pathname = replaceParamsInPath(route.get('parentPath'), routeMatch.match.params);
    route = fromJS({
      ...getRouteByPath(route.get('parentPath')),
      pathname,
    });
    routes = routes.push(route);
  }

  return routes;
}

export function getUrlParam(state, key, defaultsTo = null) {
  const route = getRouteMatchByPathname(getCurrentPathname(state));

  if (route && route.match) {
    return route.match.params[key] || defaultsTo;
  }

  return defaultsTo;
}

export function getUrlParamAsInt(state, name, defaultsTo = null) {
  return parseInt(getUrlParam(state, name, defaultsTo), 10);
}

export function getAllQueryParams(state, defaultsTo = null) {
  const search = state.getIn(['router', 'location', 'search']);

  if (!search) {
    return defaultsTo;
  }

  // `search` is a string which we convert to an object so we need `fromJS` to make it immutable
  return fromJS(
    search
      .slice(1)
      .split('&')
      .map(item => item.split('='))
      .reduce((obj, [key, value]) => {
        obj[key] = value === undefined ? true : value;
        return obj;
      }, {}),
  );
}

export function getQueryParam(state, key, defaultsTo = null) {
  const params = getAllQueryParams(state, new Map());
  return params.get(key, defaultsTo);
}

export function getQueryParamAsInt(state, key, defaultsTo = null) {
  return parseInt(getQueryParam(state, key, defaultsTo), 10);
}

export function getCurrentUrlAsObject(state, applyQueryParams) {
  const queryParams = {
    ...getAllQueryParams(state, new Map()).toJS(),
    ...applyQueryParams,
  };

  const search = Object.entries(queryParams)
    .filter(([key, value]) => value)
    .map(([key, value]) => (value === true ? key : `${key}=${value}`))
    .join('&');

  return {
    pathname: getCurrentPathname(state),
    search: search ? `?${search}` : '',
  };
}

export function getCurrentDocumentTitle(state, defaultsTo) {
  if (!defaultsTo) {
    throw new Error('defaultsTo is required for document title');
  }
  const routeTree = getCurrentRouteTree(state);
  let documentTitle = routeTree.getIn([0, 'documentTitle']);

  if (typeof documentTitle === 'function') {
    documentTitle = documentTitle(state);
  }

  let parts;
  if (Array.isArray(documentTitle)) {
    parts = [...documentTitle, defaultsTo];
  } else {
    parts = [documentTitle, defaultsTo];
  }

  return parts.filter(p => !!p).join(' • ');
}

export function getRevisionFromUrl(state, defaultsTo = null) {
  const recipeId = getUrlParamAsInt(state, 'recipeId');
  if (!recipeId) {
    return defaultsTo;
  }
  const latestRevisionId = getLatestRevisionIdForRecipe(state, recipeId, '');
  if (!latestRevisionId) {
    return defaultsTo;
  }
  const revisionId = getUrlParamAsInt(state, 'revisionId', latestRevisionId);
  return getRevision(state, revisionId, defaultsTo);
}

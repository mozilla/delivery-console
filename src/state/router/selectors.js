import { matchRoutes } from 'react-router-config';

import applicationRoutes from 'console/urls';
import { replaceParamsInPath } from 'console/utils/router';

function getRouteByPath(path) {
  return applicationRoutes.find(route => route.path === path);
}

function getRouteMatchByPathname(pathname) {
  const route = matchRoutes(applicationRoutes, pathname)[0];
  return route;
}

export function getCurrentPathname(state) {
  return state.router.location.pathname;
}

export function getCurrentRoute(state) {
  const routeMatch = getRouteMatchByPathname(getCurrentPathname(state));
  return routeMatch.route;
}

export function getCurrentRouteTree(state) {
  let pathname = getCurrentPathname(state);
  const routeMatch = getRouteMatchByPathname(pathname);

  if (!routeMatch) {
    return [];
  }

  let route = {
    ...routeMatch.route,
    pathname,
  };

  const routes = [route];

  while (route.parentPath) {
    pathname = replaceParamsInPath(route.parentPath, routeMatch.match.params);
    route = {
      ...getRouteByPath(route.parentPath),
      pathname,
    };
    routes.push(route);
  }

  return routes;
}

export function getUrlParam(state, key, defaultsTo) {
  // Cache the application routes
  const route = matchRoutes(applicationRoutes, getCurrentPathname(state))[0];

  if (route && route.match) {
    return route.match.params[key] || defaultsTo;
  }

  return defaultsTo;
}

export function getUrlParamAsInt(state, name, defaultsTo) {
  return parseInt(getUrlParam(state, name, defaultsTo), 10);
}

export function getAllQueryParams(state, defaultsTo) {
  const search = state.router.location.search;

  if (!search) {
    return defaultsTo;
  }

  return search
    .slice(1)
    .split('&')
    .map(item => item.split('='))
    .reduce((obj, [key, value]) => {
      obj[key] = value === undefined ? true : value;
      return obj;
    }, {});
}

export function getQueryParam(state, key, defaultsTo) {
  const params = getAllQueryParams(state, {});
  return params[key] || defaultsTo;
}

export function getQueryParamAsInt(state, key, defaultsTo) {
  return parseInt(getQueryParam(state, key, defaultsTo), 10);
}

export function getCurrentUrl(state, applyQueryParams) {
  const queryParams = {
    ...getAllQueryParams(state, {}),
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

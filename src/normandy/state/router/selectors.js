import { replaceUrlVariables } from 'normandy/routerUtils';

export function getUrlParam(state, name, defaultsTo) {
  return state.router.params[name] || defaultsTo;
}

export function getUrlParamAsInt(state, name, defaultsTo) {
  return parseInt(getUrlParam(state, name, defaultsTo), 10);
}

export function getQueryParam(state, key, defaultsTo) {
  let params = (window.location.search || '').replace('?', '');
  params = params.split('&');
  params = params.map(x => x.split('='));

  const query = {};
  params.forEach(set => {
    query[set[0]] = set[1];
  });

  return  query[key] || defaultsTo;
}

export function getQueryParamAsInt(state, key, defaultsTo) {
  return parseInt(getQueryParam(state, key, defaultsTo), 10);
}

export function getCurrentURL(state, queryParams) {
  return {
    pathname: state.router.pathname,
    query: {
      ...state.router.query,
      ...queryParams,
    },
  };
}

export function getRouterPath(state) {
  return state.router.pathname;
}

export function getBreadcrumbs(state) {
  const { result, pathname, params } = window.location; // state.router;
  const crumbs = [];
  let currentRoute = result;

  while (currentRoute) {
    if (currentRoute.crumb) {
      let link = replaceUrlVariables(currentRoute.route || pathname, params);
      if (!link.endsWith('/')) {
        link += '/';
      }
      crumbs.push({
        name: currentRoute.crumb,
        link,
      });
    }
    currentRoute = currentRoute.parent;
  }

  return crumbs.reverse();
}

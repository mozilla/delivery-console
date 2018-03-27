import { replaceUrlVariables } from 'normandy/routerUtils';


export function getUrlParam(props, name, defaultsTo) {
  if(!props.match){
    throw new Error('getUrlParam: no match in props', props, name);
  }
  return props.match.params[name] || defaultsTo;
}
export function getUrlParamAsInt(props, name, defaultsTo) {
  return parseInt(getUrlParam(props, name, defaultsTo), 10);
}

export function getAllQueryParams(props, defaultsTo) {
  const location = props.location;
  if(!props.location){
    throw new Error('getAllQueryParams: no location in props', props);
  }

  let strParams = (location ? location.search : '').replace('?', '');
  strParams = strParams.split('&');
  strParams = strParams.map(x => x.split('='));

  const compiled = {};
  strParams.forEach(set => {
    compiled[set[0]] = set[1];
  });

  return compiled;
}

export function getQueryParam(props, key, defaultsTo) {
  const params = getAllQueryParams(props, {});

  return  params[key] || defaultsTo;
}

export function getQueryParamAsInt(props, key, defaultsTo) {
  return parseInt(getQueryParam(props, key, defaultsTo), 10);
}

export function getCurrentURL(props, queryParams) {
  return {
    pathname: props.location.pathname,
    query: {
      ...getAllQueryParams(props, {}),
      ...queryParams,
    },
  };
}

export function getRouterPath(props) {
  return props.location.pathname;
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

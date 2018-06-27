export function collapseUrlsToRoutesList(urls, basePath = '') {
  let routesList = [];

  Object.keys(urls).forEach(k => {
    const { routes, ...thisRoute } = urls[k];
    thisRoute.path = `${basePath}${k}/`.replace(/\/+/g, '/');
    thisRoute.parentPath = basePath ? `${basePath}/`.replace(/\/+/g, '/') : null;
    thisRoute.exact = thisRoute.exact === undefined ? true : !!thisRoute.exact;
    routesList.push(thisRoute);
    if (routes) {
      routesList = routesList.concat(collapseUrlsToRoutesList(routes, thisRoute.path));
    }
  });

  return routesList;
}

export function replaceParamsInPath(path, params) {
  return Object.entries(params).reduce(
    (reduced, [key, value]) => reduced.replace(`/:${key}/`, `/${value}/`),
    path,
  );
}

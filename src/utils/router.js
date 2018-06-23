export function collapseUrlsToRoutesList(urls, basePath = '') {
  let routesList = [];

  Object.keys(urls).forEach(k => {
    const { routes, ...thisRoute } = urls[k];
    thisRoute.path = `${basePath}${k}/`.replace(/\/+/g, '/');
    thisRoute.exact = thisRoute.exact || true;
    routesList.push(thisRoute);
    if (routes) {
      routesList = routesList.concat(collapseUrlsToRoutesList(routes, thisRoute.path));
    }
  });

  return routesList;
}

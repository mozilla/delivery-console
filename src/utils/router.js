export function reduceUrlsToRoutesList(urls, basePath = '') {
  return Object.entries(urls).reduce((routesList, [path, urlObj]) => {
    const { routes, ...thisRoute } = urlObj;
    thisRoute.path = `${basePath}${path}/`.replace(/\/+/g, '/');
    thisRoute.parentPath = basePath ? `${basePath}/`.replace(/\/+/g, '/') : null;
    thisRoute.exact = thisRoute.exact === undefined ? true : !!thisRoute.exact;
    routesList.push(thisRoute);
    if (routes) {
      routesList = routesList.concat(reduceUrlsToRoutesList(routes, thisRoute.path));
    }
    return routesList;
  }, []);
}

export function replaceParamsInPath(path, params) {
  return Object.entries(params).reduce(
    (reduced, [key, value]) => reduced.replace(`/:${key}/`, `/${value}/`),
    path,
  );
}

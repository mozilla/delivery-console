import HomePage from 'console/components/pages/HomePage';
import workflows from 'console/workflows/urls';

import { collapseUrlsToRoutesList, replaceParamsInPath } from 'console/utils/router';

const routesList = collapseUrlsToRoutesList({
  '/': {
    name: 'home',
    component: HomePage,
    routes: {
      ...workflows,
    },
  },
});

export function reverse(name, params = {}) {
  const { path } = routesList.find(r => r.name === name);
  return replaceParamsInPath(path, params);
}

export default routesList;

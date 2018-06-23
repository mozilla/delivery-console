import React from 'react';
import { renderRoutes } from 'react-router-config';

import MissingPage from 'console/components/pages/MissingPage';
import urls from 'console/urls';
import { collapseUrlsToRoutesList } from 'console/utils/router';

export default class Routes extends React.Component {
  render() {
    return renderRoutes([
      ...collapseUrlsToRoutesList(urls),

      // 404 page
      {
        component: MissingPage,
      },
    ]);
  }
}

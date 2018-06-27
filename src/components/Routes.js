import React from 'react';
import { renderRoutes } from 'react-router-config';

import MissingPage from 'console/components/pages/MissingPage';
import applicationRoutes from 'console/urls';

export default class Routes extends React.Component {
  render() {
    return renderRoutes([
      ...applicationRoutes,

      // 404 page
      {
        component: MissingPage,
      },
    ]);
  }
}

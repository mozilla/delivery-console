import React from 'react';
import { renderRoutes } from 'react-router-config';

import applicationRoutes from 'console/urls';

export default class Routes extends React.Component {
  render() {
    return renderRoutes(applicationRoutes);
  }
}

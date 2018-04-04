import React from 'react';

import App from 'normandy/components/App';
import NormandyRouter, { NormandyLink } from './Router';

import './less/main.less';

export default class Root extends React.Component {
  componentWillMount() {
    // `NormandyLinks` are wrapped Links which append a prefix for nested apps.
    // At this point we know the prefix, so we can update all instances of the
    // Link here via the static PREFIX property.
    NormandyLink.PREFIX = this.props.urlPrefix || '';
  }

  render() {
    const urlPrefix = this.props.urlPrefix;

    return (
      <App>
        <NormandyRouter urlPrefix={urlPrefix} />
      </App>
    );
  }
}

import PropTypes from 'prop-types';
import React from 'react';

export class StubComponent extends React.Component {
  static propTypes = { fakeProp: PropTypes.any, children: PropTypes.any };
  render() {
    return <div>{this.props.children}</div>;
  }
}

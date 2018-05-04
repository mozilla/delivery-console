import PropTypes from 'prop-types';
import React from 'react';
import { connect } from 'react-redux';

import { fetchServiceInfo } from 'console/state/serviceInfo/actions';

@connect(null, {
  fetchServiceInfo,
})
export default class QueryServiceInfo extends React.PureComponent {
  static propTypes = {
    fetchServiceInfo: PropTypes.func.isRequired,
    accessToken: PropTypes.string.isRequired,
  };

  componentWillMount() {
    this.props.fetchServiceInfo(this.props.accessToken);
  }

  render() {
    return null;
  }
}

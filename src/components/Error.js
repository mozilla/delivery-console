import { Alert } from 'antd';
import PropTypes from 'prop-types';
import React from 'react';

export default class Error extends React.Component {
  static propTypes = {
    error: PropTypes.string,
  };

  render() {
    if (this.props.error) {
      return <Alert message={this.props.error} type="error" />;
    }
    return null;
  }
}

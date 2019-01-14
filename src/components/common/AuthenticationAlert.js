import React from 'react';
import { Alert } from 'antd';
import PropTypes from 'prop-types';

class AuthenticationAlert extends React.PureComponent {
  static propTypes = {
    description: PropTypes.string,
    message: PropTypes.string,
    type: PropTypes.string,
  };

  static defaultProps = {
    type: 'error',
    message: 'Not logged in',
  };

  render() {
    const { description, message, type } = this.props;
    return <Alert description={description} message={message} type={type} />;
  }
}

export default AuthenticationAlert;

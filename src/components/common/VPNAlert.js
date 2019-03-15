import AuthenticationAlert from './AuthenticationAlert';

class VPNAlert extends AuthenticationAlert {
  static defaultProps = {
    type: 'error',
    message: 'VPN Alert',
  };
}

export default VPNAlert;

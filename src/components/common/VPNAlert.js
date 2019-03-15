import AuthenticationAlert from './AuthenticationAlert';

export class VPNAlert extends AuthenticationAlert {
  static defaultProps = {
    type: 'error',
    message: 'VPN Alert',
  };
}

import { Icon, Tag } from 'antd';
import PropTypes from 'prop-types';
import React from 'react';
import { connect } from 'react-redux';

import QueryNormandyAdmin from 'console/components/data/QueryNormandyAdmin';
import { isNormandyAdminAvailable, isRequestInProgress } from 'console/state/network/selectors';

@connect(state => ({
  vpnAvailable: isNormandyAdminAvailable(state),
  loading: isRequestInProgress(state, 'detect-normandy-admin'),
}))
export default class VPNStatus extends React.PureComponent {
  static propTypes = {
    vpnAvailable: PropTypes.bool,
    loading: PropTypes.bool.isRequired,
  };

  static defaultProps = {
    vpnAvailable: null,
  };

  render() {
    const { loading, vpnAvailable } = this.props;

    let color = 'green';
    let message = 'VPN connected';
    let icon = null;
    if (loading) {
      color = 'gold';
      message = 'Checking VPN...';
      icon = <Icon type="loading" spin />;
    } else if (!vpnAvailable) {
      color = 'red';
      message = 'VPN disconnected';
    }

    return (
      <span className="vpn-status">
        <QueryNormandyAdmin />
        <Tag color={color} className="not-clickable">
          {icon} {message}
        </Tag>
      </span>
    );
  }
}

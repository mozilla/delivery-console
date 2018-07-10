import { Icon } from 'antd';
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
    vpnAvailable: PropTypes.bool.isRequired,
    loading: PropTypes.bool.isRequired,
  };

  render() {
    const { vpnAvailable, loading } = this.props;
    if (vpnAvailable || loading) {
      return null;
    }
    return (
      <span className="vpn-availability">
        <QueryNormandyAdmin />
        <Icon type="exclamation-circle-o" title="VPN not connected. Data may be missing." />
      </span>
    );
  }
}

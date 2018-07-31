import { Icon } from 'antd';
import cx from 'classnames';
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
    return (
      <span className={cx('vpn-availability', { loading })}>
        <QueryNormandyAdmin />
        {loading && <Icon type="question-circle-o" title="Checking VPN status..." />}
        {!loading &&
          !vpnAvailable && (
            <Icon type="exclamation-circle-o" title="VPN not connected. Data may be missing." />
          )}
      </span>
    );
  }
}

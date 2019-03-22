import React from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';

import { getUserProfile } from 'console/state/auth/selectors';
import { isNormandyAdminAvailable } from 'console/state/network/selectors';
import AuthenticationAlert from 'console/components/common/AuthenticationAlert';
import VPNAlert from 'console/components/common/VPNAlert';

function AccessBlocker(ProtectedComponent) {
  @connect(
    state => {
      return { userProfile: getUserProfile(state), vpnAvailable: isNormandyAdminAvailable(state) };
    },
    {},
  )
  class AccessBlockerInner extends React.Component {
    static propTypes = {
      // XXX How do you make this `null | instanceOf(Map)`??
      //   userProfile: PropTypes.instanceOf(Map),
      vpnAvailable: PropTypes.bool,
    };

    render() {
      const { userProfile, vpnAvailable, ...passThroughProps } = this.props;
      if (!userProfile) {
        return (
          <div className="content-wrapper">
            <AuthenticationAlert type="error" description="You must log in first." />
          </div>
        );
      }
      if (vpnAvailable === false) {
        return (
          <div className="content-wrapper">
            <VPNAlert type="error" description="You must connect to the VPN." />
          </div>
        );
      }
      return <ProtectedComponent {...passThroughProps} />;
    }
  }
  return AccessBlockerInner;
}

export default AccessBlocker;

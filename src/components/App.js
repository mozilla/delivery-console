import { Layout } from 'antd';
import { ConnectedRouter } from 'connected-react-router/immutable';
import PropTypes from 'prop-types';
import React from 'react';
import { Link } from 'react-router-dom';
import { connect } from 'react-redux';

import AuthButton from 'console/components/auth/AuthButton';
import VPNStatus from 'console/components/common/VPNStatus';
import QueryActions from 'console/components/data/QueryActions';
import QueryAuth0 from 'console/components/data/QueryAuth0';
import NavBar from 'console/components/navigation/NavBar';
import Routes from 'console/components/Routes';
import CircleLogo from 'console/components/svg/CircleLogo';
import { notifyAuthenticationError } from 'console/state/auth/actions';
import { getError } from 'console/state/auth/selectors';
import { getCurrentDocumentTitle } from 'console/state/router/selectors';
import { isNormandyAdminMaybeAvailable } from 'console/state/network/selectors';
import { reverse } from 'console/urls';

const { Header } = Layout;

@connect(
  (state, props) => ({
    authError: getError(state),
    documentTitle: getCurrentDocumentTitle(state, 'Delivery Console'),
    vpnMaybe: isNormandyAdminMaybeAvailable(state), // XXX needs new name!
  }),
  {
    notifyAuthenticationError,
  },
)
class App extends React.Component {
  static propTypes = {
    authError: PropTypes.object,
    documentTitle: PropTypes.string.isRequired,
    history: PropTypes.object.isRequired,
    vpnMaybe: PropTypes.bool,
  };

  componentDidUpdate(prevProps) {
    const { authError } = this.props;

    if (authError) {
      this.props.notifyAuthenticationError(authError);
    }
  }

  render() {
    const { documentTitle, history } = this.props;

    document.title = documentTitle;

    return (
      <ConnectedRouter history={history}>
        <Layout>
          <QueryAuth0 />

          <Header className="app-header">
            <div className="content-wrapper">
              <Link to={reverse('home')}>
                <CircleLogo width="40px" height="40px" fill="white" />
              </Link>

              <Link to={reverse('home')}>
                <h1>Delivery Console</h1>
              </Link>

              <div className="user-meta">
                <VPNStatus />
                <AuthButton />
              </div>
            </div>
          </Header>

          <NavBar />
          {this.props.vpnMaybe ? (
            <>
              <Routes />
              <QueryActions />
            </>
          ) : (
            <p>Waiting to see if VPN works</p>
          )}
        </Layout>
      </ConnectedRouter>
    );
  }
}

export default App;

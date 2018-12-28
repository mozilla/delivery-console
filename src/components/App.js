import { Layout, notification } from 'antd';
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
import { getRequestsState } from 'console/state/network/selectors';
import { getCurrentDocumentTitle } from 'console/state/router/selectors';
import { reverse } from 'console/urls';

const { Header } = Layout;

@connect(
  (state, props) => ({
    authError: getError(state),
    requests: getRequestsState(state),
    documentTitle: getCurrentDocumentTitle(state, 'Delivery Console'),
  }),
  {
    notifyAuthenticationError,
  },
)
class App extends React.Component {
  static propTypes = {
    authError: PropTypes.object,
    requests: PropTypes.object,
    history: PropTypes.object.isRequired,
    documentTitle: PropTypes.string.isRequired,
  };

  componentDidUpdate(prevProps) {
    const { authError, requests } = this.props;

    if (authError) {
      this.props.notifyAuthenticationError(authError);
    }

    // For every request that errored, has an endpoint, and is not in progress,
    // notify of the error.
    // XXX THIS IS A PROTOYYPE. WE NEED TO BE SMARTER ABOUT NOT SENDING THE SAME MESSAGE
    // IF THE LAST MESSAGE HASN'T CHANGED!
    requests
      .filter(x => {
        return x.get('error') && !x.get('inProgress') && x.get('endpoint');
      })
      .forEach(error => {
        let message = `Network errors trying to reach ${error.get('endpoint')}`;
        const data = error.get('error').data;
        if (data) {
          message += ` ${JSON.stringify(data)}`;
        }
        notification.error({
          message: 'Network Error',
          description: message,
          duration: 0,
        });
      });
  }

  render() {
    const { documentTitle, history } = this.props;

    document.title = documentTitle;

    return (
      <ConnectedRouter history={history}>
        <Layout>
          <QueryAuth0 />
          <QueryActions />

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

          <Routes />
        </Layout>
      </ConnectedRouter>
    );
  }
}

export default App;

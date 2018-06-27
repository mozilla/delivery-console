import { Layout, notification } from 'antd';
import { ConnectedRouter } from 'connected-react-router';
import PropTypes from 'prop-types';
import React from 'react';
import { Link } from 'react-router-dom';
import { connect } from 'react-redux';

import AuthButton from 'console/components/auth/AuthButton';
import NavBar from 'console/components/navigation/NavBar';
import QueryActions from 'console/components/data/QueryActions';
import QueryAuth0 from 'console/components/data/QueryAuth0';
import Routes from 'console/components/Routes';
import CircleLogo from 'console/components/svg/CircleLogo';
import { getError } from 'console/state/auth/selectors';
import { reverse } from 'console/urls';

const { Header } = Layout;

@connect((state, props) => ({
  authError: getError(state),
}))
export default class App extends React.Component {
  static propTypes = {
    authError: PropTypes.object,
    history: PropTypes.object.isRequired,
  };

  componentDidUpdate() {
    const { authError } = this.props;

    if (authError) {
      notification['error']({
        message: 'Authentication Error',
        description: `${authError.get('error')}: ${authError.get('errorDescription')}`,
        duration: 0,
      });
    }
  }

  render() {
    return (
      <ConnectedRouter history={this.props.history}>
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

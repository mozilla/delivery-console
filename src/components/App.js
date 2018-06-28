import { Layout, notification } from 'antd';
import PropTypes from 'prop-types';
import React from 'react';
import { BrowserRouter, Link } from 'react-router-dom';
import { connect } from 'react-redux';

import AuthButton from 'console/components/auth/AuthButton';
import NavBar from 'console/components/navigation/NavBar';
import QueryActions from 'console/components/data/QueryActions';
import QueryAuth0 from 'console/components/data/QueryAuth0';
import AppRouter from 'console/components/AppRouter';
import CircleLogo from 'console/components/svg/CircleLogo';
import { getError } from 'console/state/auth/selectors';

const { Header } = Layout;

@connect((state, props) => ({
  authError: getError(state),
}))
export default class App extends React.Component {
  static propTypes = {
    authError: PropTypes.object,
  };

  componentDidUpdate() {
    const { authError } = this.props;

    if (authError) {
      notification.error({
        message: 'Authentication Error',
        description: `${authError.get('error')}: ${authError.get('errorDescription')}`,
        duration: 0,
      });
    }
  }

  render() {
    return (
      <BrowserRouter>
        <Layout>
          <QueryAuth0 />
          <QueryActions />

          <Header className="app-header">
            <div className="content-wrapper">
              <Link to="/">
                <CircleLogo width="40px" height="40px" fill="white" />
              </Link>

              <Link to="/">
                <h1>Delivery Console</h1>
              </Link>

              <div className="user-meta">
                <AuthButton />
              </div>
            </div>
          </Header>

          <NavBar />

          <AppRouter />
        </Layout>
      </BrowserRouter>
    );
  }
}

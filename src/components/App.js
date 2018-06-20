import { Layout } from 'antd';
import PropTypes from 'prop-types';
import React from 'react';
import { BrowserRouter, Link } from 'react-router-dom';
import 'console/less/layout.less';
import { connect } from 'react-redux';

import Error from './Error';
import { getError } from 'console/state/auth/selectors';

import AuthButton from 'console/components/auth/AuthButton';
import NavBar from 'console/components/navigation/NavBar';
import QueryAuth0 from 'console/components/data/QueryAuth0';
import AppRouter from 'console/components/AppRouter';
import CircleLogo from 'console/components/svg/CircleLogo';
const { Header } = Layout;

@connect((state, props) => ({
  error: getError(state),
}))
export default class App extends React.Component {
  static propTypes = {
    error: PropTypes.object,
  };

  render() {
    return (
      <BrowserRouter>
        <Layout>
          <QueryAuth0 />

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

          <Error error={this.props.error} />

          <AppRouter />
        </Layout>
      </BrowserRouter>
    );
  }
}

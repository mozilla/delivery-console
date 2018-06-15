import { Layout } from 'antd';
import PropTypes from 'prop-types';
import React from 'react';
import { BrowserRouter, NavLink } from 'react-router-dom';
import 'console/less/layout.less';
import { connect } from 'react-redux';

import Error from './Error';
import { getError } from 'console/state/auth/selectors';

import AuthButton from 'console/components/auth/AuthButton';
import AppRouter from 'console/components/router';
import QueryActions from 'console/components/data/QueryActions';
import QueryAuth0 from 'console/components/data/QueryAuth0';
const { Header, Content } = Layout;

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
          <QueryActions />

          <Header className="app-header">
            <div className="content-wrapper">
              <h1>Delivery Console</h1>

              <NavLink exact to="/">
                Home
              </NavLink>
              <NavLink to="/recipe">Recipes</NavLink>
              <NavLink to="/extension">Extensions</NavLink>

              <div className="user-meta">
                <AuthButton />
              </div>
            </div>
          </Header>

          <Error error={this.props.error} />

          <Layout className="content-wrapper">
            <Content className="content">
              <AppRouter />
            </Content>
          </Layout>
        </Layout>
      </BrowserRouter>
    );
  }
}

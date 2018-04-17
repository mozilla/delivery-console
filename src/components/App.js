import { Layout } from 'antd';
import PropTypes from 'prop-types';
import React from 'react';

import NavigationMenu from 'console/components/common/NavigationMenu';
import QueryActions from 'console/components/data/QueryActions';
import QueryServiceInfo from 'console/components/data/QueryServiceInfo';

const { Content, Header } = Layout;

export default class App extends React.PureComponent {
  static propTypes = {
    children: PropTypes.node,
  };

  static defaultProps = {
    children: null,
  };

  render() {
    const { children } = this.props;

    return (
      <Layout>
        <QueryActions />
        <QueryServiceInfo />

        <Layout>
          <Header className="sidebar">
            <NavigationMenu />
          </Header>

          <Layout className="content-wrapper">
            <Content className="content">{children}</Content>
          </Layout>
        </Layout>
      </Layout>
    );
  }
}

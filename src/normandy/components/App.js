import { Layout, LocaleProvider } from 'antd';
import enUS from 'antd/lib/locale-provider/en_US';
import PropTypes from 'prop-types';
import React from 'react';

import NavigationMenu from 'normandy/components/common/NavigationMenu';
import QueryActions from 'normandy/components/data/QueryActions';
import QueryServiceInfo from 'normandy/components/data/QueryServiceInfo';

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
      <LocaleProvider locale={enUS}>
        <Layout id="normandy-app">
          {/*
           Global query components; add any queries for data needed across the
           entire app that we only need to fetch once.
           */}
          <QueryActions />
          <QueryServiceInfo />

          <Layout>
            <Header className="sidebar" breakpoint="sm" collapsedWidth="0">
              <NavigationMenu />
            </Header>

            <Layout className="content-wrapper">
              <Content className="content">{children}</Content>
            </Layout>
          </Layout>
        </Layout>
      </LocaleProvider>
    );
  }
}

import { Layout, notification } from 'antd';
import { ConnectedRouter } from 'connected-react-router/immutable';
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
import { getCurrentRouteTree } from 'console/state/router/selectors';
import { reverse } from 'console/urls';

const { Header } = Layout;

@connect((state, props) => ({
  authError: getError(state),
  routeTree: getCurrentRouteTree(state),
}))
export default class App extends React.Component {
  static propTypes = {
    authError: PropTypes.object,
    history: PropTypes.object.isRequired,
    routeTree: PropTypes.array.isRequired,
  };

  updateDocumentTitle() {
    const { routeTree } = this.props;
    const { documentTitle } = routeTree.get(0);
    let title = 'Delivery Console';
    if (documentTitle) {
      title = `${documentTitle} • ${title}`;
    }
    document.title = title;
  }

  componentDidMount() {
    this.updateDocumentTitle();
  }

  componentDidUpdate(prevProps) {
    const { authError, routeTree } = this.props;

    if (routeTree.getIn([0, 'pathname']) !== prevProps.routeTree.getIn([0, 'pathname'])) {
      this.updateDocumentTitle();
    }

    if (authError) {
      notification.error({
        message: 'Authentication Error',
        description: `${authError.get('code')}: ${authError.get('description')}`,
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

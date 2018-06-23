import { Affix, Button, Layout } from 'antd';
import PropTypes from 'prop-types';
import React from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';

import { getCurrentPathname } from 'console/state/router/selectors';

const { Header } = Layout;

@connect(state => ({ pathname: getCurrentPathname(state) }))
export default class NavBar extends React.PureComponent {
  static propTypes = {
    pathname: PropTypes.string.isRequired,
  };

  render() {
    if (this.props.pathname === '/') {
      return null;
    }

    return (
      <Affix>
        <Header className="navigator">
          <div className="content-wrapper">
            <Link to="/">
              <Button icon="home" />
            </Link>
          </div>
        </Header>
      </Affix>
    );
  }
}

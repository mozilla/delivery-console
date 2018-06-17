import { Affix, Button, Layout } from 'antd';
import React from 'react';
import { withRouter } from 'react-router';
import { Link } from 'react-router-dom';

const { Header } = Layout;

@withRouter
export default class NavBar extends React.PureComponent {
  static propTypes = {};

  render() {
    if (this.props.location.pathname === '/') {
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

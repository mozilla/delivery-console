import { Menu } from 'antd';
import PropTypes from 'prop-types';
import React from 'react';
import { NormandyLink as Link } from 'normandy/Router';
import { withRouter } from 'react-router';

const { Item } = Menu;

@withRouter
export default class NavigationMenu extends React.PureComponent {
  static propTypes = {
    history: PropTypes.object.isRequired,
  };

  render() {
    const { history } = this.props;
    const { pathname } = history.location;

    return (
      <div className="nav-menu">
        <Menu selectedKeys={[`${pathname}`]} mode="horizontal">
          <Item key={`${Link.PREFIX}/recipe/`}>
            <Link to="/recipe/">Recipes</Link>
          </Item>
          <Item key={`${Link.PREFIX}/extension/`}>
            <Link to="/extension/">Extensions</Link>
          </Item>
        </Menu>
      </div>
    );
  }
}

import { Menu } from 'antd';
import PropTypes from 'prop-types';
import React from 'react';
import { NavLink } from 'react-router-dom';
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
          <Item key={`/recipe/`}>
            <NavLink to="/recipe/">Recipes</NavLink>
          </Item>
          <Item key={`/extension/`}>
            <NavLink to="/extension/">Extensions</NavLink>
          </Item>
        </Menu>
      </div>
    );
  }
}

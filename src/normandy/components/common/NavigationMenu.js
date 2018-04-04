import { Menu } from 'antd';
import PropTypes from 'prop-types';
import React from 'react';
import { NormandyLink as Link } from 'normandy/Router';
import { withRouter } from 'react-router';

<<<<<<< 3cb717960a3d94c6adad285575b04cb48dd03b32
const { Item } = Menu;
=======
import { getSessionHistory } from 'normandy/state/app/session/selectors';
import ShieldIdenticon from 'normandy/components/common/ShieldIdenticon';

const { Divider, Item, SubMenu } = Menu;
>>>>>>> Fix karma tests

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

import { Affix, Breadcrumb, Button, Dropdown, Icon, Layout, Menu } from 'antd';
import autobind from 'autobind-decorator';
import PropTypes from 'prop-types';
import React from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';

import { LinkButton } from 'console/components/common/LinkButton';
import { cards } from 'console/components/pages/HomePage';
import { getCurrentRouteTree } from 'console/state/router/selectors';

const { Header } = Layout;

@connect(state => ({
  routeTree: getCurrentRouteTree(state),
}))
@autobind
export default class NavBar extends React.PureComponent {
  static propTypes = {
    routeTree: PropTypes.array.isRequired,
  };

  renderCrumbs() {
    const crumbs = this.props.routeTree.reverse().slice(1);

    return crumbs.map((crumb, index, origCrumbs) => {
      const selectedCard = cards.find(e => e.listingUrl === crumb.pathname);
      let crumbItem = crumb.crumbText;

      if (index === 0 && selectedCard) {
        const menu = (
          <Menu>
            {cards.map(card => (
              <Menu.Item>
                <Link to={card.listingUrl}>{card.title}</Link>
              </Menu.Item>
            ))}
          </Menu>
        );

        crumbItem = (
          <div className="card-selector">
            <LinkButton
              className="left-btn"
              to={selectedCard.listingUrl}
              disabled={index === origCrumbs.length - 1}
            >
              {selectedCard.title}
            </LinkButton>
            <Dropdown overlay={menu} placement="bottomRight" trigger="click">
              <Button className="right-btn" icon="ellipsis" />
            </Dropdown>
          </div>
        );
      } else if (index !== origCrumbs.length - 1) {
        crumbItem = <Link to={crumb.pathname}>{crumbItem}</Link>;
      }

      return <Breadcrumb.Item key={index}>{crumbItem}</Breadcrumb.Item>;
    });
  }

  render() {
    if (this.props.routeTree.length < 2) {
      return null;
    }

    return (
      <Affix>
        <Header className="navigator">
          <div className="content-wrapper">
            <Breadcrumb separator={<Icon type="right" />}>
              <Breadcrumb.Item>
                <Link to="/">
                  <Button icon="home" />
                </Link>
              </Breadcrumb.Item>
              {this.renderCrumbs()}
            </Breadcrumb>
          </div>
        </Header>
      </Affix>
    );
  }
}

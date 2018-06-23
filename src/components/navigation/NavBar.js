import { Affix, Breadcrumb, Button, Layout, Select } from 'antd';
import autobind from 'autobind-decorator';
import { push } from 'connected-react-router';
import PropTypes from 'prop-types';
import React from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';

import { cards } from 'console/components/pages/HomePage';
import { getCurrentRouteTree } from 'console/state/router/selectors';

const { Item } = Breadcrumb;
const { Header } = Layout;
const { Option } = Select;

@connect(
  state => ({
    routeTree: getCurrentRouteTree(state),
  }),
  {
    push,
  },
)
@autobind
export default class NavBar extends React.PureComponent {
  static propTypes = {
    props: PropTypes.func.isRequired,
    routeTree: PropTypes.array.isRequired,
  };

  handleChange(url) {
    this.props.push(url);
  }

  renderCrumbs() {
    const { handleChange } = this;
    const crumbs = this.props.routeTree.reverse().slice(1);
    return crumbs.map((crumb, index, origCrumbs) => {
      if (index === 0 && cards.find(e => e.listingUrl === crumb.pathname)) {
        return (
          <Item>
            <Select defaultValue={crumb.pathname} onChange={handleChange}>
              {cards.map(card => (
                <Option key={card.listingUrl} value={card.listingUrl}>
                  {card.title}
                </Option>
              ))}
            </Select>
          </Item>
        );
      } else if (index === origCrumbs.length - 1) {
        return <Item>{crumb.crumbText}</Item>;
      }

      return (
        <Item>
          <Link to={crumb.pathname}>{crumb.crumbText}</Link>
        </Item>
      );
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
            <Breadcrumb>
              <Item>
                <Link to="/">
                  <Button icon="home" />
                </Link>
              </Item>
              {this.renderCrumbs()}
            </Breadcrumb>
          </div>
        </Header>
      </Affix>
    );
  }
}

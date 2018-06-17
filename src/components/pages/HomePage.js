import { Button, Col, Row } from 'antd';
import React from 'react';
import NavigationCard from '../navigation/NavigationCard';

export const items = [
  {
    title: 'Recipes',
    description: 'SHIELD recipes',
    listingUrl: '/recipe/',
  },
  {
    title: 'Extensions',
    description: 'Web-extensions',
    listingUrl: '/extension/',
  },
];

export default class HomePage extends React.PureComponent {
  renderCards(items) {
    return items.map(item => (
      <Col span={8}>
        <NavigationCard {...item} />
      </Col>
    ));
  }

  renderRows(items) {
    const rows = [];
    for (let i = 0; i < items.length; i += 3) {
      rows.push(<Row gutter={20}>{this.renderCards(items.slice(i, i + 3))}</Row>);
    }
    return rows;
  }

  render() {
    return (
      <div className="home-page">
        <div className="intro">
          <div className="content-wrapper">
            <h2>Welcome to Delivery Console!</h2>
            <h3>This is your one stop shop for shipping things to the browser.</h3>
            <div className="cta">
              <Button type="primary" size="large">
                Let's Get Started
              </Button>
              <Button size="large">Another Button</Button>
            </div>
          </div>
        </div>

        <div className="content-wrapper">{this.renderRows(items)}</div>
      </div>
    );
  }
}

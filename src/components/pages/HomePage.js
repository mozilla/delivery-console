import { Col, Row } from 'antd';
import { Map } from 'immutable';
import PropTypes from 'prop-types';
import React from 'react';
import { connect } from 'react-redux';

import { getUserProfile } from 'console/state/auth/selectors';
import NavigationCard from 'console/components/navigation/NavigationCard';
import applicationRoutes from 'console/urls';

@connect(state => {
  return {
    userProfile: getUserProfile(state),
  };
})
class HomePage extends React.PureComponent {
  static propTypes = {
    userProfile: PropTypes.instanceOf(Map),
  };

  static defaultProps = {
    recipe: null,
    userProfile: null,
  };

  renderCards(items) {
    return items.map((item, index) => (
      <Col span={8} key={index}>
        <NavigationCard {...item} />
      </Col>
    ));
  }

  renderRows(cards) {
    const rows = [];
    for (let i = 0; i < cards.length; i += 3) {
      rows.push(
        <Row gutter={20} key={i}>
          {this.renderCards(cards.slice(i, i + 3))}
        </Row>,
      );
    }
    return rows;
  }

  render() {
    const { userProfile } = this.props;
    const cards = applicationRoutes
      .filter(r => r.cardOnHomepage)
      .map(r => ({ ...r.cardOnHomepage, listingUrl: r.path, showNewActionLink: !!userProfile }));
    return (
      <div className="home-page">
        <div className="intro">
          <div className="content-wrapper">
            <h2>Welcome to Delivery Console!</h2>
            <h3>This is your one stop shop for shipping things to the browser.</h3>

            {/* TODO: Unhide these buttons once we have appropriate content for them. */}
            {/*(
              <div className="cta">
                <Button type="primary" size="large">
                  Let's Get Started
                </Button>
                <Button size="large">Another Button</Button>
              </div>
            )*/}
          </div>
        </div>

        <div className="content-wrapper">{this.renderRows(cards)}</div>
      </div>
    );
  }
}

export default HomePage;

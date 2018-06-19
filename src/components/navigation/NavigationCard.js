import { Avatar, Card, Icon } from 'antd';
import PropTypes from 'prop-types';
import React from 'react';
import { Link } from 'react-router-dom';

const { Meta } = Card;

export default class NavigationCard extends React.PureComponent {
  static propTypes = {
    listingUrl: PropTypes.string.isRequired,
    title: PropTypes.string.isRequired,
    description: PropTypes.string.isRequired,
  };

  actions() {
    const { listingUrl } = this.props;

    return [
      <Link to={listingUrl}>
        <Icon type="bars" />
      </Link>,
      <Link to={`${listingUrl}new/`}>
        <Icon type="plus" />
      </Link>,
    ];
  }

  render() {
    const { description, listingUrl, title } = this.props;

    return (
      <Card actions={this.actions()}>
        <Link to={listingUrl}>
          <Meta
            avatar={<Avatar>{title.slice(0, 1)}</Avatar>}
            title={title}
            description={description}
          />
        </Link>
      </Card>
    );
  }
}

import PropTypes from 'prop-types';
import React from 'react';
import { connect } from 'react-redux';

import { fetchAllActions } from 'normandy/state/app/actions/actions';

@connect(
  null,
  {
    fetchAllActions,
  },
)
export default class QueryActions extends React.PureComponent {
  static propTypes = {
    fetchAllActions: PropTypes.func.isRequired,
  }

  componentWillMount() {
    this.props.fetchAllActions();
  }

  render() {
    return null;
  }
}

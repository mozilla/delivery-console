import PropTypes from 'prop-types';
import React from 'react';
import { connect } from 'react-redux';

import { fetchAllActions } from 'console/state/actions/actions';

@connect(
  null,
  {
    fetchAllActions,
  },
)
class QueryActions extends React.PureComponent {
  static propTypes = {
    fetchAllActions: PropTypes.func.isRequired,
  };

  componentDidMount() {
    this.props.fetchAllActions();
  }

  render() {
    return null;
  }
}

export default QueryActions;

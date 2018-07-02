import PropTypes from 'prop-types';
import React from 'react';
import { connect } from 'react-redux';

import { fetchRecipeHistory } from 'console/state/recipes/actions';

@connect(
  null,
  {
    fetchRecipeHistory,
  },
)
export default class QueryRecipeHistory extends React.PureComponent {
  static propTypes = {
    fetchRecipeHistory: PropTypes.func.isRequired,
    pk: PropTypes.number.isRequired,
  };

  componentWillMount() {
    const { pk } = this.props;
    this.props.fetchRecipeHistory(pk);
  }

  componentWillReceiveProps(nextProps) {
    const { pk } = this.props;
    if (pk !== nextProps.pk) {
      this.props.fetchRecipeHistory(nextProps.pk);
    }
  }

  render() {
    return null;
  }
}

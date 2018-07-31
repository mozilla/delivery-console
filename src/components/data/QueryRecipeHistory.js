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

  componentDidMount() {
    const { pk } = this.props;
    this.props.fetchRecipeHistory(pk);
  }

  componentDidUpdate(prevProps) {
    const { pk } = this.props;
    if (pk !== prevProps.pk) {
      this.props.fetchRecipeHistory(pk);
    }
  }

  render() {
    return null;
  }
}

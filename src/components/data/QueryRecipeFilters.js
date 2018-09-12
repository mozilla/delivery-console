import PropTypes from 'prop-types';
import React from 'react';
import { connect } from 'react-redux';

import { fetchRecipeFilters } from 'console/state/recipes/actions';

@connect(
  null,
  {
    fetchRecipeFilters,
  },
)
class QueryRecipeFilters extends React.PureComponent {
  static propTypes = {
    fetchRecipeFilters: PropTypes.func.isRequired,
  };

  componentDidMount() {
    this.props.fetchRecipeFilters();
  }

  render() {
    return null;
  }
}

export default QueryRecipeFilters;

import PropTypes from 'prop-types';
import React from 'react';
import { connect } from 'react-redux';

import { loadRecipeListingColumns } from 'console/state/recipes/actions';

@connect(
  null,
  {
    loadRecipeListingColumns,
  },
)
class QueryRecipeListingColumns extends React.PureComponent {
  static propTypes = {
    loadRecipeListingColumns: PropTypes.func.isRequired,
  };

  componentDidMount() {
    this.props.loadRecipeListingColumns();
  }

  render() {
    return null;
  }
}

export default QueryRecipeListingColumns;

import PropTypes from 'prop-types';
import React from 'react';
import { connect } from 'react-redux';
import isEqual from 'lodash/isEqual';

import { fetchFilteredRecipesPage } from 'console/state/recipes/actions';

@connect(
  null,
  {
    fetchFilteredRecipesPage,
  },
)
export default class QueryFilteredRecipes extends React.PureComponent {
  static propTypes = {
    fetchFilteredRecipesPage: PropTypes.func,
    filters: PropTypes.object,
    pageNumber: PropTypes.number,
  };

  static defaultProps = {
    fetchFilteredRecipesPage: null,
    filters: {},
    pageNumber: 1,
  };

  componentDidMount() {
    const { filters, pageNumber } = this.props;
    this.props.fetchFilteredRecipesPage(pageNumber, filters);
  }

  componentDidUpdate(prevProps) {
    const { filters, pageNumber } = this.props;
    if (pageNumber !== prevProps.pageNumber || !isEqual(filters, prevProps.filters)) {
      this.props.fetchFilteredRecipesPage(pageNumber, filters);
    }
  }

  render() {
    return null;
  }
}

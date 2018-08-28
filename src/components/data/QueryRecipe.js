import PropTypes from 'prop-types';
import React from 'react';
import { connect } from 'react-redux';

import { fetchRecipe } from 'console/state/recipes/actions';

@connect(
  null,
  {
    fetchRecipe,
  },
)
class QueryRecipe extends React.PureComponent {
  static propTypes = {
    fetchRecipe: PropTypes.func.isRequired,
    pk: PropTypes.number.isRequired,
  };

  componentDidMount() {
    const { pk } = this.props;
    this.props.fetchRecipe(pk);
  }

  componentDidUpdate(prevProps) {
    const { pk } = this.props;
    if (pk !== prevProps.pk) {
      this.props.fetchRecipe(pk);
    }
  }

  render() {
    return null;
  }
}

export default QueryRecipe;

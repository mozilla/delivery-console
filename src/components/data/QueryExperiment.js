import PropTypes from 'prop-types';
import React from 'react';
import { connect } from 'react-redux';

import { fetchExperimentRecipeData } from 'console/state/recipes/actions';

@connect(
  null,
  {
    fetchExperimentRecipeData,
  },
)
class QueryActions extends React.PureComponent {
  static propTypes = {
    fetchExperimentRecipeData: PropTypes.func.isRequired,
    slug: PropTypes.string.isRequired,
  };

  componentDidMount() {
    const { slug } = this.props;
    this.props.fetchExperimentRecipeData(slug);
  }

  componentDidUpdate(prevProps) {
    const { slug } = this.props;
    if (slug !== prevProps.slug) {
      this.props.fetchExperimentRecipeData(slug);
    }
  }

  render() {
    return null;
  }
}

export default QueryActions;

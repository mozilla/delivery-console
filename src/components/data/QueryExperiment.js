import { notification } from 'antd';
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

  async componentDidMount() {
    const { slug } = this.props;
    try {
      await this.props.fetchExperimentRecipeData(slug);
    } catch (error) {
      notification.error({
        message: 'Import Error',
        description: error.message,
        duration: 0,
      });
    }
  }

  async componentDidUpdate(prevProps) {
    const { slug } = this.props;
    if (slug !== prevProps.slug) {
      try {
        await this.props.fetchExperimentRecipeData(slug);
      } catch (error) {
        notification.error({
          message: 'Import Error',
          description: error.message,
          duration: 0,
        });
      }
    }
  }

  render() {
    return null;
  }
}

export default QueryActions;

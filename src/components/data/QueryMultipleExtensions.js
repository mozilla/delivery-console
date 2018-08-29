import PropTypes from 'prop-types';
import React from 'react';
import { connect } from 'react-redux';
import isEqual from 'lodash/isEqual';

import { fetchExtensionsPage } from 'console/state/extensions/actions';

@connect(
  null,
  {
    fetchExtensionsPage,
  },
)
class QueryMultipleExtensions extends React.PureComponent {
  static propTypes = {
    fetchExtensionsPage: PropTypes.func.isRequired,
    filters: PropTypes.object,
    pageNumber: PropTypes.number,
  };

  static defaultProps = {
    filters: {},
    pageNumber: null,
  };

  componentDidMount() {
    const { filters, pageNumber } = this.props;
    this.props.fetchExtensionsPage(pageNumber, filters);
  }

  componentDidUpdate(prevProps) {
    const { filters, pageNumber } = this.props;
    if (pageNumber !== prevProps.pageNumber || !isEqual(filters, prevProps.filters)) {
      this.props.fetchExtensionsPage(pageNumber, filters);
    }
  }

  render() {
    return null;
  }
}

export default QueryMultipleExtensions;

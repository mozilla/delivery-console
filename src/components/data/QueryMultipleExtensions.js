import PropTypes from 'prop-types';
import React from 'react';
import { connect } from 'react-redux';
import { isEqual } from 'lodash';

import { fetchExtensionsPage } from 'console/state/extensions/actions';

@connect(
  null,
  {
    fetchExtensionsPage,
  },
)
export default class QueryMultipleExtensions extends React.PureComponent {
  static propTypes = {
    fetchExtensionsPage: PropTypes.func.isRequired,
    filters: PropTypes.object,
    pageNumber: PropTypes.number,
  };

  static defaultProps = {
    filters: {},
    pageNumber: null,
  };

  componentWillMount() {
    const { filters, pageNumber } = this.props;
    this.props.fetchExtensionsPage(pageNumber, filters);
  }

  componentWillReceiveProps(nextProps) {
    const { filters, pageNumber } = this.props;
    if (pageNumber !== nextProps.pageNumber || !isEqual(filters, nextProps.filters)) {
      this.props.fetchExtensionsPage(nextProps.pageNumber, nextProps.filters);
    }
  }

  render() {
    return null;
  }
}

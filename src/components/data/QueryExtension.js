import PropTypes from 'prop-types';
import React from 'react';
import { connect } from 'react-redux';

import { fetchExtension } from 'console/state/extensions/actions';

@connect(
  null,
  {
    fetchExtension,
  },
)
export default class QueryExtension extends React.PureComponent {
  static propTypes = {
    fetchExtension: PropTypes.func.isRequired,
    pk: PropTypes.number.isRequired,
  };

  componentDidMount() {
    const { pk } = this.props;
    this.props.fetchExtension(pk);
  }

  componentDidUpdate(prevProps) {
    const { pk } = this.props;
    if (pk !== prevProps.pk) {
      this.props.fetchExtension(pk);
    }
  }

  render() {
    return null;
  }
}

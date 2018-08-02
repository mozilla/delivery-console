import PropTypes from 'prop-types';
import React from 'react';
import { connect } from 'react-redux';

import { fetchRevision } from 'console/state/revisions/actions';

@connect(
  null,
  {
    fetchRevision,
  },
)
export default class QueryRevision extends React.PureComponent {
  static propTypes = {
    fetchRevision: PropTypes.func.isRequired,
    pk: PropTypes.number.isRequired,
  };

  componentDidMount() {
    const { pk } = this.props;
    this.props.fetchRevision(pk);
  }

  componentDidUpdate(prevProps) {
    const { pk } = this.props;
    if (pk !== prevProps.pk) {
      this.props.fetchRevision(pk);
    }
  }

  render() {
    return null;
  }
}

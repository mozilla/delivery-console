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

  componentWillMount() {
    const { pk } = this.props;
    this.props.fetchRevision(pk);
  }

  componentWillReceiveProps(nextProps) {
    const { pk } = this.props;
    if (pk !== nextProps.pk) {
      this.props.fetchRevision(nextProps.pk);
    }
  }

  render() {
    return null;
  }
}

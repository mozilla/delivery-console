import PropTypes from 'prop-types';
import React from 'react';
import { connect } from 'react-redux';

import { detectNormandyAdmin } from 'console/state/network/actions';

@connect(
  null,
  {
    detectNormandyAdmin,
  },
)
class QueryNormandyAdmin extends React.PureComponent {
  static propTypes = {
    detectNormandyAdmin: PropTypes.func.isRequired,
  };

  async componentDidMount() {
    this.props.detectNormandyAdmin();
  }

  render() {
    return null;
  }
}

export default QueryNormandyAdmin;

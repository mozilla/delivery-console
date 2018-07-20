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
export default class QueryNormandyAdmin extends React.PureComponent {
  static propTypes = {
    detectNormandyAdmin: PropTypes.func.isRequired,
  };

  async componentWillMount() {
    this.props.detectNormandyAdmin();
  }

  render() {
    return null;
  }
}

import { Input } from 'antd';
import autobind from 'autobind-decorator';
import PropTypes from 'prop-types';
import React from 'react';

@autobind
class StringPreferenceField extends React.PureComponent {
  static propTypes = {
    onChange: PropTypes.func.isRequired,
  };

  handleChange(event) {
    const { onChange } = this.props;
    onChange(event.target.value.trim());
  }
  render() {
    const { onChange, ...other } = this.props;
    return <Input onChange={this.handleChange} {...other} />;
  }
}

export default StringPreferenceField;

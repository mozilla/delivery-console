import { InputNumber } from 'antd';
import React from 'react';

export default class IntegerPreferenceField extends React.PureComponent {
  render() {
    return <InputNumber {...this.props} />;
  }
}

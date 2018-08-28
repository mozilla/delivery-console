import { Icon, Radio } from 'antd';
import { PropTypes } from 'prop-types';
import React from 'react';

export default class BooleanPreferenceField extends React.PureComponent {
  static propTypes = {
    value: PropTypes.bool,
  };

  static defaultProps = {
    value: null,
  };

  render() {
    return (
      <Radio.Group {...this.props}>
        <Radio.Button value={true} className="pref-true">
          <Icon type="check" /> True
        </Radio.Button>
        <Radio.Button value={false} className="pref-false">
          <Icon type="close" /> False
        </Radio.Button>
      </Radio.Group>
    );
  }
}

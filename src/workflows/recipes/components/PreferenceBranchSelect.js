import { Select } from 'antd';
import PropTypes from 'prop-types';
import React from 'react';

import { connectFormProps } from 'console/utils/forms';

/**
 * Select that shows a warning when the user preference branch is selected.
 */
@connectFormProps
class PreferenceBranchSelect extends React.PureComponent {
  static propTypes = {
    disabled: PropTypes.bool,
    onChange: PropTypes.func.isRequired,
    value: PropTypes.any,
  };

  static defaultProps = {
    disabled: false,
    value: 'default',
  };

  render() {
    const { disabled, onChange, value } = this.props;
    return (
      <Select disabled={disabled} onChange={onChange} value={value} {...this.props}>
        <Select.Option value="default">Default</Select.Option>
        <Select.Option value="user">User</Select.Option>
      </Select>
    );
  }
}

export default PreferenceBranchSelect;

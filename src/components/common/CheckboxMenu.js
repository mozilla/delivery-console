import { Button, Checkbox, Popover } from 'antd';
import PropTypes from 'prop-types';
import React from 'react';

export default class CheckboxMenu extends React.PureComponent {
  static propTypes = {
    checkboxes: PropTypes.array,
    label: PropTypes.string,
    onChange: PropTypes.func,
    options: PropTypes.array,
  };

  static defaultProps = {
    checkboxes: null,
    label: null,
    onChange: null,
    options: null,
  };

  render() {
    const { checkboxes, label, onChange, options } = this.props;

    const menu = (
      <Checkbox.Group
        className="checkbox-menu"
        onChange={onChange}
        options={options}
        defaultValue={checkboxes}
      />
    );

    return (
      <Popover content={menu} trigger="click" placement="bottomLeft">
        <Button icon="bars">{label}</Button>
      </Popover>
    );
  }
}

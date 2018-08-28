import { Switch } from 'antd';
import autobind from 'autobind-decorator';

import LabeledInput from './LabeledInput';

@autobind
class SwitchBox extends LabeledInput {
  handleLabelClick() {
    const newValue = !this.props.value;

    this.props.onChange(newValue);
  }

  getElement() {
    // TODO: Remove this hack-y fix for webpack build issue (#195)
    const Element = Switch;
    return Element;
  }

  getElementProps() {
    const { value } = this.props;

    return {
      checked: value,
    };
  }

  getLabelProps() {
    const { value } = this.props;

    return {
      role: 'checkbox',
      'aria-checked': value,
    };
  }
}

export default SwitchBox;

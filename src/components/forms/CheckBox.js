import { Checkbox } from 'antd';
import autobind from 'autobind-decorator';

import LabeledInput from './LabeledInput';

@autobind
export default class LabeledCheckbox extends LabeledInput {
  getElement() {
    // TODO: Remove this hack-y fix for webpack build issue (#195)
    const Element = Checkbox;
    return Element;
  }

  getElementProps() {
    return { checked: this.props.value };
  }

  getLabelProps() {
    return {
      role: 'checkbox',
      'aria-checked': this.props.value,
    };
  }
}

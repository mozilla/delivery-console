import { Button, Input, InputNumber } from 'antd';
import autobind from 'autobind-decorator';
import { Map } from 'immutable';
import PropTypes from 'prop-types';
import React from 'react';

import FormItem from 'console/components/forms/FormItem';
import BooleanPreferenceField from 'console/workflows/recipes/components/BooleanPreferenceField';
import IntegerPreferenceField from 'console/workflows/recipes/components/IntegerPreferenceField';
import StringPreferenceField from 'console/workflows/recipes/components/StringPreferenceField';
import { connectFormProps } from 'console/utils/forms';

@connectFormProps
@autobind
class ExperimentBranchFields extends React.PureComponent {
  static propTypes = {
    branch: PropTypes.instanceOf(Map).isRequired,
    disabled: PropTypes.bool,
    fieldName: PropTypes.string.isRequired,
    form: PropTypes.object.isRequired,
    index: PropTypes.number.isRequired,
    onChange: PropTypes.func.isRequired,
    onClickDelete: PropTypes.func.isRequired,
  };

  static defaultProps = {
    disabled: false,
  };

  static VALUE_FIELDS = {
    string: StringPreferenceField,
    integer: IntegerPreferenceField,
    boolean: BooleanPreferenceField,
  };

  handleClickDelete() {
    const { index, onClickDelete } = this.props;
    onClickDelete(index);
  }

  // Bind the name parameter to individual functions to avoid re-renders due
  // to prop comparison and anonymous functions.
  handleChangeSlug(event) {
    this.handleChange('slug', event);
  }

  handleChangeValue(event) {
    this.handleChange('value', event);
  }

  handleChangeRatio(event) {
    this.handleChange('ratio', event);
  }

  handleChange(name, event) {
    const { branch, index, onChange } = this.props;

    // InputNumber passes the value as the parameter, but Input and
    // Radio pass it via event.target.value.
    let value = event;
    if (event && event.target) {
      value = event.target.value;
    }

    onChange(index, branch.set(name, value));
  }

  render() {
    const { branch, disabled, fieldName, form } = this.props;
    const preferenceType = form.getFieldValue('arguments.preferenceType');
    const ValueField = ExperimentBranchFields.VALUE_FIELDS[preferenceType];
    return (
      <div className="branch-fields">
        <FormItem label="Branch Name" name={`${fieldName}.slug`} connectToForm={false}>
          <Input
            disabled={disabled}
            value={branch.get('slug', '')}
            onChange={this.handleChangeSlug}
            id="pef-branch-name"
          />
        </FormItem>
        <FormItem label="Preference Value" name={`${fieldName}.value`} connectToForm={false}>
          <ValueField
            disabled={disabled}
            value={branch.get('value')}
            onChange={this.handleChangeValue}
          />
        </FormItem>
        <FormItem label="Ratio" name={`${fieldName}.ratio`} connectToForm={false}>
          <InputNumber
            disabled={disabled}
            value={branch.get('ratio', '')}
            onChange={this.handleChangeRatio}
          />
        </FormItem>
        <Button
          className="delete-btn"
          disabled={disabled}
          type="danger"
          icon="close"
          onClick={this.handleClickDelete}
        >
          Delete Branch
        </Button>
      </div>
    );
  }
}

export default ExperimentBranchFields;

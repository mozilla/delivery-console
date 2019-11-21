import { Button, Input, InputNumber } from 'antd';
import autobind from 'autobind-decorator';
import { Map } from 'immutable';
import PropTypes from 'prop-types';
import React from 'react';

import FormItem from 'console/components/forms/FormItem';
import { connectFormProps } from 'console/utils/forms';
import ExtensionSelect from 'console/workflows/extensions/components/ExtensionSelect';

@connectFormProps
@autobind
class AddonBranchFields extends React.PureComponent {
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

  handleClickDelete() {
    const { index, onClickDelete } = this.props;
    onClickDelete(index);
  }

  // Bind the name parameter to individual functions to avoid re-renders due
  // to prop comparison and anonymous functions.
  handleChangeSlug(event) {
    this.handleChange('slug', event);
  }

  handleChangeRatio(event) {
    this.handleChange('ratio', event);
  }

  handleChangeExtensionApiId(event) {
    this.handleChange('extensionApiId', event);
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
    const { branch, disabled, fieldName } = this.props;
    return (
      <React.Fragment>
        <div className="branch-fields">
          <FormItem label="Branch Name" name={`${fieldName}.slug`} connectToForm={false}>
            <Input
              disabled={disabled}
              value={branch.get('slug', '')}
              onChange={this.handleChangeSlug}
              id="pef-branch-name"
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
        <div className="branch-extension-fields">
          <FormItem label="Extension" name="arguments.extensionApiId" connectToForm={false}>
            <ExtensionSelect
              value={branch.get('extensionApiId', '')}
              disabled={disabled}
              onChange={this.handleChangeExtensionApiId}
            />
          </FormItem>
        </div>
      </React.Fragment>
    );
  }
}

export default AddonBranchFields;

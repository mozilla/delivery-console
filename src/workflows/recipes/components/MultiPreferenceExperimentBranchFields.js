import { Button, Input, InputNumber, Select } from 'antd';
import autobind from 'autobind-decorator';
import { List, Map } from 'immutable';
import PropTypes from 'prop-types';
import React from 'react';

import FormItem from 'console/components/forms/FormItem';
import BooleanPreferenceField from 'console/workflows/recipes/components/BooleanPreferenceField';
import IntegerPreferenceField from 'console/workflows/recipes/components/IntegerPreferenceField';
import PreferenceBranchSelect from 'console/workflows/recipes/components/PreferenceBranchSelect';
import StringPreferenceField from 'console/workflows/recipes/components/StringPreferenceField';
import { connectFormProps } from 'console/utils/forms';

@connectFormProps
@autobind
class MultiPreferenceExperimentBranchFields extends React.PureComponent {
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

  handleChangePreferences(event) {
    this.handleChange('preferences', event);
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
        <BranchPreferences
          disabled={disabled}
          preferences={branch.get('preferences')}
          onChange={this.handleChangePreferences}
        />
      </React.Fragment>
    );
  }
}

@autobind
class BranchPreferences extends React.PureComponent {
  handleChange(prefName, pref, oldPrefName) {
    const { onChange, preferences } = this.props;
    let updated = preferences.set(prefName, pref);
    if ((oldPrefName || oldPrefName === '') && oldPrefName !== prefName) {
      updated = updated.delete(oldPrefName);
    }
    onChange(updated);
  }

  handleClickAdd() {
    this.handleChange(
      '',
      new Map({
        preferenceValue: '',
        preferenceType: 'string',
        preferenceBranchType: 'default',
      }),
    );
  }

  deletePreference(prefName) {
    const { onChange, preferences } = this.props;
    onChange(preferences.delete(prefName));
  }

  render() {
    const { disabled, preferences } = this.props;
    return (
      <div className="branch-prefs">
        <strong>Branch Preferences</strong>
        <ul>
          {List(preferences).map(([prefName, pref], index) => (
            <PreferenceFields
              key={index}
              disabled={disabled}
              prefName={prefName}
              pref={pref}
              onChange={this.handleChange}
              deletePreference={this.deletePreference}
            />
          ))}
        </ul>
        <Button
          disabled={disabled || preferences.keySeq().includes('')}
          type="default"
          icon="plus"
          onClick={this.handleClickAdd}
        >
          Add Preference
        </Button>
      </div>
    );
  }
}

@autobind
class PreferenceFields extends React.PureComponent {
  static VALUE_FIELDS = {
    string: StringPreferenceField,
    integer: IntegerPreferenceField,
    boolean: BooleanPreferenceField,
  };

  handleChangePrefName(event) {
    const { onChange, pref, prefName } = this.props;
    onChange(event.target.value, pref, prefName);
  }

  handleChangePrefBranchType(value) {
    const { onChange, pref, prefName } = this.props;
    onChange(prefName, pref.set('preferenceBranchType', value));
  }

  handleChangePrefType(value) {
    const { onChange, pref, prefName } = this.props;
    onChange(prefName, pref.set('preferenceType', value));
  }

  handleChangePrefValue(event) {
    const { onChange, pref, prefName } = this.props;

    // InputNumber passes the value as the parameter, but Input and
    // Radio pass it via event.target.value.
    let value = event;
    if (event && event.target) {
      value = event.target.value;
    }

    onChange(prefName, pref.set('preferenceValue', value));
  }

  handleClickDelete() {
    const { deletePreference, prefName } = this.props;
    deletePreference(prefName);
  }

  render() {
    const { disabled, prefName, pref } = this.props;
    const ValueField = PreferenceFields.VALUE_FIELDS[pref.get('preferenceType')];

    return (
      <li className="multi-pref-fields">
        <div>
          <FormItem label="Preference Name" name={`preferenceName`} connectToForm={false}>
            <Input disabled={disabled} value={prefName} onChange={this.handleChangePrefName} />
          </FormItem>

          <FormItem
            label="Preference Branch Type"
            name="preferenceBranchType"
            connectToForm={false}
          >
            <PreferenceBranchSelect
              disabled={disabled}
              value={pref.get('preferenceBranchType')}
              onChange={this.handleChangePrefBranchType}
            />
          </FormItem>

          <Button
            className="delete-btn"
            disabled={disabled}
            type="danger"
            icon="close"
            onClick={this.handleClickDelete}
          >
            Delete Preference
          </Button>
        </div>
        <div>
          <FormItem label="Preference Type" name="preferenceType" connectToForm={false}>
            <Select
              value={pref.get('preferenceType')}
              disabled={disabled}
              onChange={this.handleChangePrefType}
            >
              <Select.Option value="boolean">Boolean</Select.Option>
              <Select.Option value="integer">Integer</Select.Option>
              <Select.Option value="string">String</Select.Option>
            </Select>
          </FormItem>

          <FormItem label="Preference Value" name="preferenceValue" connectToForm={false}>
            <ValueField
              disabled={disabled}
              value={pref.get('preferenceValue')}
              onChange={this.handleChangePrefValue}
            />
          </FormItem>
        </div>
      </li>
    );
  }
}

export default MultiPreferenceExperimentBranchFields;

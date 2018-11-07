/* eslint-disable react/jsx-boolean-value */
import { Row, Col, Button, Input, InputNumber, Select } from 'antd';
import { Map, List } from 'immutable';
import PropTypes from 'prop-types';
import React from 'react';

import FormItem from 'console/components/forms/FormItem';
import SwitchBox from 'console/components/forms/SwitchBox';
import { connectFormProps } from 'console/utils/forms';

const DEFAULT_VALUES = {
  string: '',
  boolean: false,
  integer: 0,
};

export const serializePreferenceRows = prefsList => {
  if (!prefsList) {
    return List([]);
  }
  let nextId = 0;
  return prefsList.map(pref => {
    const value = pref.get('value');
    let type;
    if (typeof value === 'string') {
      type = 'string';
    } else if (typeof value === 'boolean') {
      type = 'boolean';
    } else if (typeof value === 'number') {
      type = 'integer';
    } else {
      throw new Error(`Unrecognized preference type ${typeof value} (${value})`);
    }
    return {
      name: pref.get('preferenceName'),
      type,
      value,
      id: nextId++,
    };
  });
};

export const deserializePreferenceRows = prefsList => {
  return List(
    // The reason for the filter is to remove any form argument items that are null
    // or undefined which can happen when deleting a <FormItem> object.
    prefsList
      .filter(row => !!row)
      .map(row => {
        return {
          preferenceName: row.name,
          value: row.value,
        };
      }),
  );
};

@connectFormProps
class PreferenceRolloutFields extends React.Component {
  state = {
    rows: serializePreferenceRows(this.props.recipeArguments.get('preferences')),
  };

  static propTypes = {
    disabled: PropTypes.bool,
    form: PropTypes.object.isRequired,
    recipeArguments: PropTypes.instanceOf(Map),
  };

  static defaultProps = {
    disabled: false,
    recipeArguments: new Map(),
  };

  // Use a locally increasing number too to avoid the case were a new ID is one that
  // it's already been.
  nextId = 0;

  handleClickAddNewRow = () => {
    this.setState(state => {
      // Default to the same type as the last row.
      // Useful if you add a bunch of booleans one after the other.
      const type = state.rows.length ? state.rows[state.rows.length - 1].type : 'string';

      // The nextId needs never be a number we've used before.
      const ids = [...state.rows.values()].map(r => r.id);
      const nextId = 1 + (ids.length ? Math.max(...ids) : 0) + this.nextId++;

      return {
        rows: state.rows.push({
          name: '',
          type: type,
          value: DEFAULT_VALUES[type],
          id: nextId,
        }),
      };
    });
  };

  changeRow = row => {
    this.setState(state => {
      return {
        rows: state.rows.map(r => {
          if (r.id === row.id) {
            return row;
          }
          return r;
        }),
      };
    });
  };

  removeRow = id => {
    // Don't allow this if there are currently only 1 rows.
    if (this.state.rows.size <= 1) {
      throw new Error('There must be at least one row left.');
    }

    this.setState(state => {
      return {
        rows: state.rows.filter(r => r.id !== id),
      };
    });
  };

  render() {
    const { disabled, recipeArguments } = this.props;

    return (
      <div>
        <Row>
          <p className="action-info">Roll out a permanent preference change.</p>
          <Col sm={24} md={11}>
            <FormItem
              label="Slug"
              name="arguments.slug"
              initialValue={recipeArguments.get('slug', '')}
            >
              <Input disabled={disabled} />
            </FormItem>
          </Col>
        </Row>

        <p className="action-info">Preferences</p>

        {this.state.rows.map(row => (
          <RowField
            id={row.id}
            name={row.name}
            type={row.type}
            value={row.value}
            defaultValues={DEFAULT_VALUES}
            disabled={disabled}
            key={row.id}
            disableRemove={this.state.rows.size <= 1}
            onRowChange={this.changeRow}
            onRowRemove={this.removeRow}
          />
        ))}

        <Button
          disabled={disabled}
          type="default"
          icon="plus"
          onClick={this.handleClickAddNewRow}
          id="add-row"
        >
          Add Row
        </Button>
      </div>
    );
  }
}

export default PreferenceRolloutFields;

export class RowField extends React.PureComponent {
  static propTypes = {
    id: PropTypes.number.isRequired,
    name: PropTypes.string,
    type: PropTypes.string,
    value: PropTypes.oneOfType([PropTypes.string, PropTypes.number, PropTypes.bool]),
    defaultValues: PropTypes.object,
    disabled: PropTypes.bool,
    disableRemove: PropTypes.bool,
  };

  static defaultProps = {
    defaultValues: DEFAULT_VALUES,
    disabled: false,
    disableRemove: false,
  };

  handleNameChange = event => {
    const name = event.target.value;
    const { id, type, value } = this.props;
    this.props.onRowChange({
      id,
      name,
      type,
      value,
    });
  };

  handleTypeChange = type => {
    const { defaultValues } = this.props;
    if (!defaultValues.hasOwnProperty(type)) {
      throw new Error(`Unrecognized value type for '${type}'`);
    }
    const { id, name } = this.props;
    const value = defaultValues[type];
    this.props.onRowChange({
      id,
      name,
      type,
      value,
    });
  };

  handleValueChange = value => {
    const { id, name, type } = this.props;
    this.props.onRowChange({
      id,
      name,
      type,
      value,
    });
  };

  handleInputValueChange = event => {
    this.handleValueChange(event.target.value);
  };

  render() {
    // The reason for passing the `id` is so that we can have a unique thing that
    // makes the `name` on each <FormItem> different and unique.
    const { disabled, disableRemove, id, name, type, value } = this.props;

    let valueInput;
    if (type === 'string') {
      valueInput = <Input disabled={disabled} onChange={this.handleInputValueChange} />;
    } else if (type === 'boolean') {
      valueInput = <SwitchBox disabled={disabled} onChange={this.handleValueChange} />;
    } else if (type === 'integer') {
      valueInput = <InputNumber disabled={disabled} onChange={this.handleValueChange} />;
    } else {
      throw new Error(`Unrecognized value type (${type})`);
    }

    return (
      <Row gutter={8} align="bottom">
        <Col span={6}>
          <FormItem label="Name" name={`arguments.preferences.${id}.name`} initialValue={name}>
            <Input disabled={disabled} onChange={this.handleNameChange} />
          </FormItem>
        </Col>
        <Col span={4}>
          <FormItem label="Type" name={`arguments.preferences.${id}.type`} initialValue={type}>
            <Select disabled={disabled} onChange={this.handleTypeChange}>
              <Select.Option value="string">String</Select.Option>
              <Select.Option value="boolean">Boolean</Select.Option>
              <Select.Option value="integer">Integer</Select.Option>
            </Select>
          </FormItem>
        </Col>
        <Col span={10}>
          <FormItem label="Value" name={`arguments.preferences.${id}.value`} initialValue={value}>
            {valueInput}
          </FormItem>
        </Col>
        <Col span={4} style={{ textAlign: 'right' }}>
          <div className="ant-form-item-no-colon">
            <div className="ant-form-item-label">
              <label> </label>
            </div>
            <div>
              <Button
                disabled={disabled || disableRemove}
                type="default"
                title={disableRemove ? 'There must be at least 1 preference' : null}
                icon="close"
                onClick={() => this.props.onRowRemove(id)}
                id={`${id}.remove-row`}
              >
                Remove Row
              </Button>
            </div>
          </div>
        </Col>
      </Row>
    );
  }
}

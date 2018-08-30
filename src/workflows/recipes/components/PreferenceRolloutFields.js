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
  let _nextId = 0;
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
      id: _nextId++,
    };
  });
};

export const deserializePreferenceRows = prefsList => {
  return List(
    // The reason for the filter is to remove any form argument items that are null
    // or undefined which can happen when deleting a <FormItem> object.
    prefsList.filter(row => !!row).map(row => {
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
  _nextId = 0;

  handleClickAddNewRow = () => {
    this.setState(state => {
      // Default to the same type as the last row.
      // Useful if you add a bunch of booleans one after the other.
      const type = state.rows.length ? state.rows[state.rows.length - 1].type : 'string';

      // The nextId needs never be a number we've used before.
      // XXX This is getting complicated. Maybe just use Math.random()/
      const ids = [...state.rows.values()].map(r => r.id);
      const nextId = 1 + (ids.length ? Math.max(...ids) : 0) + this._nextId++;

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
    this.setState(state =>
      state.rows.map(r => {
        if (r.id === row.id) {
          return row;
        }
        return r;
      }),
    );
  };

  removeRow = row => {
    // Don't allow this if there are currently only 1 rows.
    if (this.state.rows.size <= 1) {
      throw new Error('There must be at least one row left.');
    }

    this.setState(state => {
      return {
        rows: state.rows.filter(r => r.id !== row.id),
      };
    });
  };

  render() {
    const { disabled, recipeArguments } = this.props;

    return (
      <div>
        <Row>
          <p className="action-info">XXX - Come up with a better line here.</p>
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
            row={row}
            defaultValues={DEFAULT_VALUES}
            disabled={disabled}
            key={row.id}
            disableRemove={this.state.rows.size <= 1}
            onRowChange={row => {
              this.changeRow(row);
            }}
            onRowRemove={row => {
              this.removeRow(row);
            }}
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
  state = {
    name: this.props.row.name,
    type: this.props.row.type,
    value: this.props.row.value,
  };

  static propTypes = {
    row: PropTypes.object.isRequired,
    defaultValues: PropTypes.object,
    disabled: PropTypes.bool,
    disableRemove: PropTypes.bool,
  };

  static defaultProps = {
    defaultValues: DEFAULT_VALUES,
    disabled: false,
    disableRemove: false,
  };

  // XXX Not a great name.
  _reportRow = () => {
    this.props.onRowChange({
      name: this.state.name,
      type: this.state.type,
      value: this.state.value,
    });
  };

  handleNameChange = name => {
    this.setState(() => {
      return { name: name.trim() };
    }, this._reportRow);
  };

  handleTypeChange = type => {
    const { defaultValues } = this.props;
    if (!defaultValues.hasOwnProperty(type)) {
      throw new Error(`Unrecognized value type for '${type}'`);
    }
    this.setState(
      {
        type,
        value: defaultValues[type],
      },
      this._reportRow,
    );
  };

  handleValueChange = value => {
    this.setState({ value }, this._reportRow);
  };

  render() {
    // The reason for passing the `i` is so that we can have a unique thing that
    // makes the `name` on each <FormItem> different and unique.
    const { disabled, row, disableRemove } = this.props;
    const { id } = row;
    const { name, type, value } = this.state;

    let valueInput;
    if (type === 'string') {
      valueInput = (
        <Input
          disabled={disabled}
          onChange={event => this.handleValueChange(event.target.value)}
        />
      );
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
            <Input
              disabled={disabled}
              onChange={event => this.handleNameChange(event.target.value)}
            />
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
                onClick={() => this.props.onRowRemove(row)}
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

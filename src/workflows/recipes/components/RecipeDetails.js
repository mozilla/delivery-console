import { Card, Icon, Table, Tag, Tooltip } from 'antd';
import { List, Map } from 'immutable';
import PropTypes from 'prop-types';
import React from 'react';
import CopyToClipboard from 'react-copy-to-clipboard';

import {
  serializeFilterObjectToMap,
  SAMPLING_TYPES,
  smartNumberFormatting,
} from 'console/workflows/recipes/components/FilterObjectForm';

export default class RecipeDetails extends React.PureComponent {
  static propTypes = {
    revision: PropTypes.instanceOf(Map).isRequired,
  };

  render() {
    const { revision } = this.props;
    const actionName = revision.getIn(['action', 'name']);
    const filterObject = revision.get('filter_object');
    const extraFilterExpression = revision.get('extra_filter_expression');
    return (
      <div className="recipe-details">
        <Card className="noHovering" key="recipe-details" title="Recipe">
          <dl className="details">
            <dt>Name</dt>
            <ArgumentsValue name="name" value={revision.get('name')} />

            {filterObject && filterObject.size ? <dt>Filters</dt> : null}
            {filterObject && filterObject.size ? (
              <ArgumentsValue name="filter_object" value={revision.get('filter_object')} />
            ) : null}

            <dt>
              {filterObject && filterObject.size ? 'Extra Filter Expression' : 'Filter Expression'}
            </dt>
            <ArgumentsValue
              name="extra_filter_expression"
              value={extraFilterExpression}
              defaultValue={<em>none</em>}
            />
          </dl>
        </Card>

        <Card className="noHovering" key="action-details" title="Action">
          <dl className="details">
            <dt>Name</dt>
            <ArgumentsValue name="name" value={actionName} />

            {revision
              .get('arguments', new Map())
              .map((value, key) => [
                <dt key={`dt-${key}`}>{key.replace(/([A-Z]+)/g, ' $1')}</dt>,
                <ArgumentsValue
                  key={`dd-${key}`}
                  name={key}
                  value={value}
                  actionName={actionName}
                />,
              ])
              .toArray()}
          </dl>
        </Card>
      </div>
    );
  }
}

export class ArgumentsValue extends React.PureComponent {
  static propTypes = {
    name: PropTypes.string,
    defaultValue: PropTypes.any,
    value: PropTypes.any,
    actionName: PropTypes.string,
  };

  static defaultProps = {
    name: null,
    actionName: null,
    defaultValue: null,
  };

  static stringifyImmutable(value) {
    return JSON.stringify(value, null, 2);
  }

  // Determine if an object is an instance of any of the given classes
  compareInstances(obj, types) {
    return types.some(type => obj instanceof type);
  }

  renderBranchTable(branches) {
    const sumRatios = branches.map(branch => branch.get('ratio')).reduce((a, b) => a + b) || 1;

    return (
      <table className="pref-experiment-branches">
        <thead>
          <tr>
            <th>Slug</th>
            <th>Value</th>
            <th className="right">Ratio</th>
          </tr>
        </thead>
        <tbody>
          {branches.map(branch => (
            <tr key={branch.get('slug')}>
              <td>{branch.get('slug')}</td>
              <td>
                <ArgumentsValue name="value" value={branch.get('value')} />
              </td>
              <td className="right">{Math.round((branch.get('ratio') / sumRatios) * 100)}%</td>
            </tr>
          ))}
        </tbody>
      </table>
    );
  }

  renderPreferencesTable(preferences) {
    return (
      <table className="pref-rollout-preferences">
        <thead>
          <tr>
            <th>Name</th>
            <th>Value</th>
          </tr>
        </thead>
        <tbody>
          {preferences.map((pref, i) => {
            const name = pref.get('preferenceName');
            const value = pref.get('value');
            let type = typeof value;
            if (type === 'number') {
              type = 'integer';
            }
            return (
              <tr key={`${name}.${i}`}>
                <td>{name}</td>
                <td>
                  <code>{value.toString()}</code> <Tag>{type}</Tag>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    );
  }

  renderFilterObject(values) {
    if (!values) {
      return null;
    }

    // The reason for hardcoding this ordered list of keys is so that it more resembles
    // the order of which these inputs appear when editing.
    const KEYS = [
      ['locales', 'Locale'],
      ['countries', 'Country'],
      ['channels', 'Channel'],
      ['versions', 'Version'],
      ['_sampling', 'Sampling'],
    ];
    const samplingTypes = {};
    for (const { value, label } of SAMPLING_TYPES) {
      samplingTypes[value] = label;
    }
    const serialized = serializeFilterObjectToMap(values);
    const dataSource = [];
    const columns = [
      {
        title: 'Name',
        dataIndex: 'name',
      },
      {
        title: 'Value(s)',
        dataIndex: 'value',
      },
    ];
    for (const [key, label] of KEYS) {
      const value = serialized.get(key);
      // All others except special '_sampling' is a List instance.
      if (value && (key === '_sampling' || value.size)) {
        if (key === '_sampling') {
          const samplingColumns = [
            { title: 'Name', dataIndex: 'name' },
            { title: 'Value', dataIndex: 'value' },
          ];
          const samplingType = value.get('type');
          const samplingSource = [
            { key: 'type', name: 'Type', value: samplingTypes[samplingType] },
          ];
          if (samplingType === 'stableSample') {
            samplingSource.push({
              key: 'rate',
              name: 'Rate',
              value: smartNumberFormatting(value.get('rate') * 100) + '%',
            });
          } else if (samplingType === 'bucketSample') {
            samplingSource.push({
              key: 'start',
              name: 'Start',
              value: value.get('start'),
            });
            samplingSource.push({
              key: 'count',
              name: 'Count',
              value: value.get('count'),
            });
            samplingSource.push({
              key: 'total',
              name: 'Total',
              value: value.get('total'),
            });
          } else {
            throw new Error(`Unrecognized sampling type (${samplingType})`);
          }
          samplingSource.push({
            key: 'input',
            name: 'Input',
            value: <code>{value.get('input').join(', ')}</code>,
          });
          dataSource.push({
            key: key,
            name: label,
            value: (
              <Table
                dataSource={samplingSource}
                columns={samplingColumns}
                pagination={false}
                showHeader={false}
                size="middle"
              />
            ),
          });
        } else {
          dataSource.push({
            key: key,
            name: label,
            value: <code>{value.join(', ')}</code>,
          });
        }
      }
    }
    return (
      <Table
        dataSource={dataSource}
        columns={columns}
        pagination={false}
        showHeader={false}
        bordered={false}
        size="middle"
      />
    );
  }

  renderCode(code) {
    return (
      <pre>
        <code>{code}</code>
      </pre>
    );
  }

  renderBoolean(value) {
    return value ? 'True' : 'False';
  }

  render() {
    const { actionName, defaultValue, name, value } = this.props;

    let valueRender = x => (typeof x === 'object' ? JSON.stringify(x, null, 2) : x);
    let argumentsValueClassName = 'arguments-value';

    if (name === 'branches') {
      valueRender = this.renderBranchTable;
    } else if (name === 'filter_object') {
      valueRender = this.renderFilterObject;
      argumentsValueClassName += ' no-padding';
    } else if (name === 'extra_filter_expression') {
      valueRender = this.renderCode;
    } else if (typeof value === 'boolean') {
      valueRender = this.renderBoolean;
    } else if (actionName === 'preference-rollout' && name === 'preferences') {
      valueRender = this.renderPreferencesTable;
    }

    // It's not good enough to check if the value is falsy to determine whether to show
    // the default value instead. For example if it's "false" (type boolean) we want to
    // display that as code. E.g. `<code>false</code>` or `<code>0</code>`.
    let realValue = !(value === null || value === undefined);
    let textToCopy = null;
    if (realValue) {
      textToCopy = value === undefined ? '' : value.toString();
      if (this.compareInstances(value, [List, Map])) {
        textToCopy = ArgumentsValue.stringifyImmutable(value);
      }
    }

    return (
      <dd className={argumentsValueClassName}>
        <div className="value">{realValue ? valueRender(value) : defaultValue}</div>
        {realValue ? (
          <Tooltip mouseEnterDelay={1} title="Copy to Clipboard" placement="top">
            <CopyToClipboard className="copy-icon" text={textToCopy}>
              <Icon type="copy" />
            </CopyToClipboard>
          </Tooltip>
        ) : null}
      </dd>
    );
  }
}

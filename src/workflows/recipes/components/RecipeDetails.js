import { Card, Icon, Tag, Tooltip } from 'antd';
import { List, Map } from 'immutable';
import PropTypes from 'prop-types';
import React from 'react';
import CopyToClipboard from 'react-copy-to-clipboard';

export default class RecipeDetails extends React.PureComponent {
  static propTypes = {
    recipe: PropTypes.instanceOf(Map).isRequired,
  };

  render() {
    const { recipe } = this.props;
    const actionName = recipe.getIn(['action', 'name']);

    return (
      <div className="recipe-details">
        <Card className="noHovering" key="recipe-details" title="Recipe">
          <dl className="details">
            <dt>Name</dt>
            <ArgumentsValue name="name" value={recipe.get('name')} />

            <dt>Filters</dt>
            <ArgumentsValue
              name="extra_filter_expression"
              value={recipe.get('extra_filter_expression')}
            />
          </dl>
        </Card>

        <Card className="noHovering" key="action-details" title="Action">
          <dl className="details">
            <dt>Name</dt>
            <ArgumentsValue name="name" value={actionName} />

            {recipe
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
    value: PropTypes.any,
  };

  static defaultProps = {
    name: null,
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
    const { name, actionName, value } = this.props;

    let valueRender = x => (typeof x === 'object' ? JSON.stringify(x, null, 2) : x);

    if (name === 'branches') {
      valueRender = this.renderBranchTable;
    } else if (name === 'extra_filter_expression') {
      valueRender = this.renderCode;
    } else if (typeof value === 'boolean') {
      valueRender = this.renderBoolean;
    } else if (actionName === 'preference-rollout' && name === 'preferences') {
      valueRender = this.renderPreferencesTable;
    }

    let textToCopy = value === undefined ? '' : value.toString();
    if (this.compareInstances(value, [List, Map])) {
      textToCopy = ArgumentsValue.stringifyImmutable(value);
    }

    return (
      <dd className="arguments-value">
        <div className="value">{valueRender(value)}</div>
        <Tooltip mouseEnterDelay={1} title="Copy to Clipboard" placement="top">
          <CopyToClipboard className="copy-icon" text={textToCopy}>
            <Icon type="copy" />
          </CopyToClipboard>
        </Tooltip>
      </dd>
    );
  }
}

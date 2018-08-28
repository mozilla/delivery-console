import { Select } from 'antd';
import { Map } from 'immutable';
import PropTypes from 'prop-types';
import React from 'react';
import { connect } from 'react-redux';

import { getAllActions } from 'console/state/actions/selectors';

@connect(state => ({
  actions: getAllActions(state, new Map()),
}))
class ActionSelect extends React.PureComponent {
  static propTypes = {
    actions: PropTypes.instanceOf(Map).isRequired,
    value: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  };

  static defaultProps = {
    value: null,
  };

  render() {
    const { actions, value, ...props } = this.props;

    // Select values have to be strings or else we get propType errors.
    const stringValue = value ? value.toString(10) : undefined;

    return (
      <div id="rf-action-select">
        <Select placeholder="Select an action..." value={stringValue} {...props}>
          {actions.toList().map((action, index) => {
            const actionId = action.get('id') || index;
            const actionName = action.get('name');
            const actionValue = (actionId || '').toString(10);

            return (
              <Select.Option key={actionId} value={actionValue} className={`rf-${actionName}`}>
                {actionName}
              </Select.Option>
            );
          })}
        </Select>
      </div>
    );
  }
}

export default ActionSelect;

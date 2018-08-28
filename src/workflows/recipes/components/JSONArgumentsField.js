import { Input } from 'antd';
import { Map } from 'immutable';
import PropTypes from 'prop-types';
import React from 'react';

import FormItem from 'console/components/forms/FormItem';

export default class JSONArgumentsField extends React.Component {
  static propTypes = {
    disabled: PropTypes.bool,
    recipeArguments: PropTypes.instanceOf(Map),
  };

  static defaultProps = {
    disabled: false,
    recipeArguments: new Map(),
  };

  render() {
    const { disabled, recipeArguments } = this.props;

    return (
      <div>
        <p className="action-info">
          Contextual UI is not available for this action. A generic JSON field has been provided
          instead.
        </p>
        <FormItem
          name="arguments"
          label="JSON Blob"
          initialValue={JSON.stringify(recipeArguments, null, 2)}
        >
          <Input.TextArea rows={4} disabled={disabled} />
        </FormItem>
      </div>
    );
  }
}

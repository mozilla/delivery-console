import { Row, Col, Button, Form, Input, Select } from 'antd';
import autobind from 'autobind-decorator';
import { is, Map } from 'immutable';
import PropTypes from 'prop-types';
import React from 'react';
import { connect } from 'react-redux';

import FormItem from 'console/components/forms/FormItem';
import FormActions from 'console/components/forms/FormActions';
import ConsoleLogFields from 'console/workflows/recipes/components/ConsoleLogFields';
import JSONArgumentsField from 'console/workflows/recipes/components/JSONArgumentsField';
import PreferenceExperimentFields from 'console/workflows/recipes/components/PreferenceExperimentFields';
import ShowHeartbeatFields from 'console/workflows/recipes/components/ShowHeartbeatFields';
import OptOutStudyFields from 'console/workflows/recipes/components/OptOutStudyFields';
import { getAction, getAllActions } from 'console/state/actions/selectors';
import { areAnyRequestsInProgress } from 'console/state/network/selectors';
import { createForm } from 'console/utils/forms';
import IdenticonField from 'console/components/forms/IdenticonField';

export function cleanRecipeData(data) {
  // Handle generic JSON textfield arguments
  if (typeof data.arguments === 'string') {
    try {
      data.arguments = JSON.parse(data.arguments);
    } catch (error) {
      error.data = { arguments: 'Invalid JSON.' };
      throw error;
    }
  }

  // Make sure the action ID is an integer
  try {
    data.action_id = parseInt(data.action_id, 10);
  } catch (error) {
    error.data = { action_id: 'Invalid Action ID.' };
    throw error;
  }

  return data;
}

/**
 * Form for editing recipes.
 */
@createForm({})
@connect((state, props) => {
  const actionId = props.form.getFieldValue('action_id');
  const selectedAction = getAction(state, actionId, new Map());
  return {
    selectedActionName: selectedAction.get('name'),
    isLoading: areAnyRequestsInProgress(state),
  };
})
@autobind
export default class RecipeForm extends React.PureComponent {
  static propTypes = {
    form: PropTypes.object.isRequired,
    isLoading: PropTypes.bool,
    isCreationForm: PropTypes.bool,
    onSubmit: PropTypes.func.isRequired,
    recipe: PropTypes.instanceOf(Map),
    selectedActionName: PropTypes.string,
  };

  static defaultProps = {
    isLoading: false,
    isCreationForm: false,
    recipe: new Map(),
  };

  static argumentsFields = {
    'console-log': ConsoleLogFields,
    'show-heartbeat': ShowHeartbeatFields,
    'preference-experiment': PreferenceExperimentFields,
    'opt-out-study': OptOutStudyFields,
  };

  constructor(props) {
    super(props);

    this.state = {
      defaultIdenticonSeed: IdenticonField.generateSeed(),
    };
  }

  componentDidUpdate(prevProps) {
    // Initial values are mostly handled via props, but if the recipe
    // changes, we need to reset the values stored in the state.
    if (!is(prevProps.recipe, this.props.recipe)) {
      this.props.form.resetFields();
    }
  }

  renderArgumentsFields() {
    const { isLoading, recipe, selectedActionName } = this.props;
    let ArgumentsFields = RecipeForm.argumentsFields[selectedActionName];

    if (selectedActionName && !ArgumentsFields) {
      ArgumentsFields = JSONArgumentsField;
    }

    if (!ArgumentsFields) {
      return null;
    }

    return (
      <fieldset>
        <legend>Action Arguments</legend>
        <ArgumentsFields recipeArguments={recipe.get('arguments')} disabled={isLoading} />
      </fieldset>
    );
  }

  render() {
    const { isCreationForm, isLoading, onSubmit, recipe } = this.props;
    const { defaultIdenticonSeed } = this.state;

    // If creating, the 'default' seed is randomly generated. We store it in memory
    // to prevent the form from generating a new identicon on each render.
    const identiconSeed = isCreationForm ? defaultIdenticonSeed : null;

    return (
      <Form onSubmit={onSubmit} className="recipe-form">
        <Row gutter={16}>
          <Col xs={24} sm={18}>
            <FormItem name="name" label="Name" initialValue={recipe.get('name')}>
              <Input disabled={isLoading} />
            </FormItem>
          </Col>

          <Col xs={24} sm={6}>
            <FormItem
              name="identicon_seed"
              initialValue={recipe.get('identicon_seed', identiconSeed)}
            >
              <IdenticonField disabled={isLoading} />
            </FormItem>
          </Col>
        </Row>

        <FormItem
          name="extra_filter_expression"
          label="Filter Expression"
          initialValue={recipe.get('extra_filter_expression')}
        >
          <Input.TextArea disabled={isLoading} rows={4} />
        </FormItem>
        <FormItem name="action_id" label="Action" initialValue={recipe.getIn(['action', 'id'])}>
          <ActionSelect disabled={isLoading} />
        </FormItem>

        {this.renderArgumentsFields()}

        <FormActions>
          <FormActions.Primary>
            <Button type="primary" htmlType="submit" disabled={isLoading} id="rf-save-button">
              Save
            </Button>
          </FormActions.Primary>
        </FormActions>
      </Form>
    );
  }
}

@connect(state => ({
  actions: getAllActions(state, new Map()),
}))
export class ActionSelect extends React.PureComponent {
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

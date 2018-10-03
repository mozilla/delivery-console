import { Row, Col, Button, Form, Input } from 'antd';
import autobind from 'autobind-decorator';
import { is, Map } from 'immutable';
import PropTypes from 'prop-types';
import React from 'react';
import { connect } from 'react-redux';

import FormItem from 'console/components/forms/FormItem';
import FormActions from 'console/components/forms/FormActions';
import ActionSelect from 'console/workflows/recipes/components/ActionSelect';
import ConsoleLogFields from 'console/workflows/recipes/components/ConsoleLogFields';
import FilterObjectForm, {
  serializeFilterObjectToMap,
  deserializeFilterObjectToList,
} from 'console/workflows/recipes/components/FilterObjectForm';
import JSONArgumentsField from 'console/workflows/recipes/components/JSONArgumentsField';
import PreferenceExperimentFields from 'console/workflows/recipes/components/PreferenceExperimentFields';
import PreferenceRolloutFields, {
  deserializePreferenceRows,
} from 'console/workflows/recipes/components/PreferenceRolloutFields';
import ShowHeartbeatFields from 'console/workflows/recipes/components/ShowHeartbeatFields';
import OptOutStudyFields from 'console/workflows/recipes/components/OptOutStudyFields';
import { getAction } from 'console/state/actions/selectors';
import { getRecipeFilters } from 'console/state/recipes/selectors';
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
  } else if (data.arguments.preferences) {
    // If the form submission has a data.arguments.preferences it's a PreferenceRolloutFields
    // field. In that case, rewrite the list of rows into an expected list of preferences.
    data.arguments.preferences = deserializePreferenceRows(data.arguments.preferences);
  }
  // Have to turn the filter_object object into an array.
  // When submitted it's an object like `{locales: ['sv']}` and it needs to become:
  // `[{type: 'locale': locales: ['sv']}]` for example.
  data.filter_object = deserializeFilterObjectToList(data.filter_object);
  if (!data.filter_object.size && !data.extra_filter_expression) {
    // You can't submit a recipe with no extra filter expression and no filter object rules.
    // Error thrown here will be automatically turned into a notification message in the UI.
    throw new Error('Have you have at least one filter object or a filter expression.');
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
    filters: getRecipeFilters(state, new Map()),
  };
})
@autobind
class RecipeForm extends React.PureComponent {
  static propTypes = {
    filters: PropTypes.object,
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
    'preference-rollout': PreferenceRolloutFields,
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
    const { filters, isCreationForm, isLoading, onSubmit, recipe } = this.props;
    const { defaultIdenticonSeed } = this.state;

    // If creating, the 'default' seed is randomly generated. We store it in memory
    // to prevent the form from generating a new identicon on each render.
    const identiconSeed = isCreationForm ? defaultIdenticonSeed : null;

    // The recipe object has an **array of objects** which we need to turn around
    // to an object of keys and values. For example,
    //   [{type: 'country', countries:['sv']}, ...]
    // becomes
    //   {countries: ['sv'], ...}
    const filterObject = serializeFilterObjectToMap(recipe.get('filter_object'));

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

        <FilterObjectForm
          form={this.props.form}
          disabled={isLoading}
          filterObject={filterObject}
          allLocales={filters.get('locales')}
          allCountries={filters.get('countries')}
          allChannels={filters.get('channels')}
        />

        <FormItem
          name="extra_filter_expression"
          label="Additional Filter Expression"
          required={false}
          rules={[{ required: false }]}
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

export default RecipeForm;

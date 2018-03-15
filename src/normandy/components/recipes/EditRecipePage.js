import { message } from 'antd';
import autobind from 'autobind-decorator';
import { is, Map } from 'immutable';
import PropTypes from 'prop-types';
import React from 'react';
import { connect } from 'react-redux';

import handleError from 'normandy/utils/handleError';
import GenericFormContainer from 'normandy/components/recipes/GenericFormContainer';
import LoadingOverlay from 'normandy/components/common/LoadingOverlay';
import RecipeForm from 'normandy/components/recipes/RecipeForm';
import QueryRecipe from 'normandy/components/data/QueryRecipe';

import { addSessionView } from 'normandy/state/app/session/actions';

import { updateRecipe } from 'normandy/state/app/recipes/actions';
import { getRecipe } from 'normandy/state/app/recipes/selectors';
import { getRecipeForRevision } from 'normandy/state/app/revisions/selectors';
import { getUrlParamAsInt } from 'normandy/state/router/selectors';


@connect(
  state => {
    const recipeId = getUrlParamAsInt(state, 'recipeId');
    const recipe = getRecipe(state, recipeId, new Map());

    return {
      recipeId,
      recipe: getRecipeForRevision(state, recipe.getIn(['latest_revision', 'id']), new Map()),
    };
  },
  {
    addSessionView,
    updateRecipe,
  },
)
@autobind
export default class EditRecipePage extends React.PureComponent {
  static propTypes = {
    addSessionView: PropTypes.func.isRequired,
    updateRecipe: PropTypes.func.isRequired,
    recipeId: PropTypes.number.isRequired,
    recipe: PropTypes.instanceOf(Map),
  };

  static defaultProps = {
    recipe: null,
  };

  componentDidMount() {
    const recipeName = this.props.recipe.get('name');
    if (recipeName) {
      this.props.addSessionView('recipe', recipeName, this.props.recipe.get('identicon_seed'));
    }
  }

  componentWillReceiveProps({ recipe }) {
    const oldRecipe = this.props.recipe;

    // New recipe means we add a session view.
    if (!is(oldRecipe, recipe)) {
      const recipeName = recipe.get('name');
      this.props.addSessionView('recipe', recipeName, recipe.get('identicon_seed'));
    }
  }

  onFormSuccess() {
    message.success('Recipe updated!');
  }

  onFormFailure(error) {
    handleError('Recipe cannot be updated.', error);
  }

  async formAction(formValues) {
    const { recipeId } = this.props;
    return this.props.updateRecipe(recipeId, formValues);
  }

  render() {
    const { recipeId, recipe } = this.props;

    return (
      <div className="edit-page">
        <QueryRecipe pk={recipeId} />
        <LoadingOverlay requestIds={`fetch-recipe-${recipeId}`}>
          <h2>Edit Recipe</h2>
          <GenericFormContainer
            form={RecipeForm}
            formAction={this.formAction}
            onSuccess={this.onFormSuccess}
            onFailure={this.onFormFailure}
            formProps={{ recipe }}
          />
        </LoadingOverlay>
      </div>
    );
  }
}

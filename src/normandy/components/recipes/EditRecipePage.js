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

import { updateRecipe } from 'normandy/state/app/recipes/actions';
import { getRecipe } from 'normandy/state/app/recipes/selectors';
import { getRecipeForRevision } from 'normandy/state/app/revisions/selectors';
import { getUrlParamAsInt } from 'normandy/state/router/selectors';

@connect(
  (state, props) => {
    const recipeId = getUrlParamAsInt(props, 'recipeId');
    const recipe = getRecipe(state, recipeId, new Map());

    return {
      recipeId,
      recipe: getRecipeForRevision(
        state,
        recipe.getIn(['latest_revision', 'id']),
        new Map(),
      ),
    };
  },
  {
    updateRecipe,
  },
)
@autobind
export default class EditRecipePage extends React.PureComponent {
  static propTypes = {
    updateRecipe: PropTypes.func.isRequired,
    recipeId: PropTypes.number.isRequired,
    recipe: PropTypes.instanceOf(Map),
  };

  static defaultProps = {
    recipe: null,
  };

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

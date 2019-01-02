import { Alert, message } from 'antd';
import autobind from 'autobind-decorator';
import { Map } from 'immutable';
import PropTypes from 'prop-types';
import React from 'react';
import { connect } from 'react-redux';

import { getUserProfile } from 'console/state/auth/selectors';
import handleError from 'console/utils/handleError';
import GenericFormContainer from 'console/workflows/recipes/components/GenericFormContainer';
import LoadingOverlay from 'console/components/common/LoadingOverlay';
import RecipeForm, { cleanRecipeData } from 'console/workflows/recipes/components/RecipeForm';
import QueryRecipe from 'console/components/data/QueryRecipe';
import { updateRecipe } from 'console/state/recipes/actions';
import { getRecipe } from 'console/state/recipes/selectors';
import { getRecipeForRevision } from 'console/state/revisions/selectors';
import { getUrlParamAsInt } from 'console/state/router/selectors';

@connect(
  (state, props) => {
    const recipeId = getUrlParamAsInt(state, 'recipeId');
    const recipe = getRecipe(state, recipeId, new Map());

    return {
      recipeId,
      recipe: getRecipeForRevision(state, recipe.getIn(['latest_revision', 'id']), new Map()),
      userProfile: getUserProfile(state),
    };
  },
  {
    updateRecipe,
  },
)
@autobind
class EditRecipePage extends React.PureComponent {
  static propTypes = {
    updateRecipe: PropTypes.func.isRequired,
    recipeId: PropTypes.number.isRequired,
    recipe: PropTypes.instanceOf(Map),
    userProfile: PropTypes.instanceOf(Map),
  };

  static defaultProps = {
    recipe: null,
    userProfile: null,
  };

  onFormSuccess() {
    message.success('Recipe updated!');
  }

  onFormFailure(error) {
    handleError('Recipe cannot be updated.', error);
  }

  async formAction(data) {
    const { recipeId } = this.props;
    const cleanedData = cleanRecipeData(data);
    return this.props.updateRecipe(recipeId, cleanedData);
  }

  render() {
    const { recipeId, recipe, userProfile } = this.props;

    if (!userProfile) {
      return (
        <div className="content-wrapper">
          <Alert
            type="error"
            message="Not logged in"
            description="You must be logged in to edit this recipe."
          />
        </div>
      );
    }

    return (
      <div className="content-wrapper edit-page">
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

export default EditRecipePage;

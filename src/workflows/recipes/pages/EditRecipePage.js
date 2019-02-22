import { message } from 'antd';
import autobind from 'autobind-decorator';
import { Map } from 'immutable';
import PropTypes from 'prop-types';
import React from 'react';
import { connect } from 'react-redux';

import { AuthenticationAlert } from 'console/components/common/AuthenticationAlert';
import { getUserProfile } from 'console/state/auth/selectors';
import handleError from 'console/utils/handleError';
import GenericFormContainer from 'console/workflows/recipes/components/GenericFormContainer';
import LoadingOverlay from 'console/components/common/LoadingOverlay';
import RecipeForm, { cleanRecipeData } from 'console/workflows/recipes/components/RecipeForm';
import QueryRecipe from 'console/components/data/QueryRecipe';
import { updateRecipe } from 'console/state/recipes/actions';
import { getLatestRevisionForRecipe } from 'console/state/recipes/selectors';
import { getUrlParamAsInt } from 'console/state/router/selectors';

@connect(
  (state, props) => {
    const recipeId = getUrlParamAsInt(state, 'recipeId');
    const revision = getLatestRevisionForRecipe(state, recipeId, new Map());

    return {
      recipeId,
      revision,
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
    recipeId: PropTypes.number.isRequired,
    revision: PropTypes.instanceOf(Map),
    updateRecipe: PropTypes.func.isRequired,
    userProfile: PropTypes.instanceOf(Map),
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
    const { revision, recipeId, userProfile } = this.props;
    if (!userProfile) {
      return (
        <div className="content-wrapper">
          <AuthenticationAlert
            type="error"
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
            formProps={{ revision }}
          />
        </LoadingOverlay>
      </div>
    );
  }
}

export default EditRecipePage;

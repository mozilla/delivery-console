import { Alert, message } from 'antd';
import autobind from 'autobind-decorator';
import { Map } from 'immutable';
import { push } from 'connected-react-router';
import PropTypes from 'prop-types';
import React from 'react';
import { connect } from 'react-redux';

import { getUserProfile } from 'console/state/auth/selectors';
import handleError from 'console/utils/handleError';
import GenericFormContainer from 'console/workflows/recipes/components/GenericFormContainer';
import RecipeForm, { cleanRecipeData } from 'console/workflows/recipes/components/RecipeForm';
import { createRecipe } from 'console/state/recipes/actions';
import { reverse } from 'console/urls';

@connect(
  state => {
    return { userProfile: getUserProfile(state) };
  },
  {
    createRecipe,
    push,
  },
)
@autobind
class CreateRecipePage extends React.PureComponent {
  static propTypes = {
    createRecipe: PropTypes.func.isRequired,
    push: PropTypes.func.isRequired,
    userProfile: PropTypes.instanceOf(Map),
  };

  static defaultProps = {
    userProfile: null,
  };

  onFormFailure(err) {
    handleError('Recipe cannot be created.', err);
  }

  onFormSuccess(recipeId) {
    message.success('Recipe created');
    this.props.push(reverse('recipes.details', { recipeId }));
  }

  async formAction(data) {
    const cleanedData = cleanRecipeData(data);
    return this.props.createRecipe(cleanedData);
  }

  render() {
    const { userProfile } = this.props;

    if (!userProfile) {
      return (
        <div className="content-wrapper">
          <Alert
            type="error"
            message="Not logged in"
            description="You must be logged in to create a recipe."
          />
        </div>
      );
    }
    return (
      <div className="content-wrapper">
        <h2>Create New Recipe</h2>
        <GenericFormContainer
          form={RecipeForm}
          formAction={this.formAction}
          onSuccess={this.onFormSuccess}
          onFailure={this.onFormFailure}
          formProps={{ isCreationForm: true }}
        />
      </div>
    );
  }
}

export default CreateRecipePage;

import { message } from 'antd';
import autobind from 'autobind-decorator';
import { push } from 'connected-react-router';
import PropTypes from 'prop-types';
import React from 'react';
import { connect } from 'react-redux';

import handleError from 'console/utils/handleError';
import GenericFormContainer from 'console/components/recipes/GenericFormContainer';
import RecipeForm, { cleanRecipeData } from 'console/components/recipes/RecipeForm';
import { createRecipe } from 'console/state/recipes/actions';
import { reverse } from 'console/urls';

@connect(
  null,
  {
    createRecipe,
    push,
  },
)
@autobind
export default class CreateRecipePage extends React.PureComponent {
  static propTypes = {
    createRecipe: PropTypes.func.isRequired,
    push: PropTypes.func.isRequired,
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

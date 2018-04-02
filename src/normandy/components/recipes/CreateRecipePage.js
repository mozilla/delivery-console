import { message } from 'antd';
import autobind from 'autobind-decorator';
import PropTypes from 'prop-types';
import React from 'react';
import { connect } from 'react-redux';
import { withRouter } from 'react-router';

import handleError from 'normandy/utils/handleError';
import GenericFormContainer from 'normandy/components/recipes/GenericFormContainer';
import RecipeForm from 'normandy/components/recipes/RecipeForm';

import { createRecipe as createAction } from 'normandy/state/app/recipes/actions';
import { NormandyLink } from '../../Router';

@withRouter
@connect(null, {
  createRecipe: createAction,
})
@autobind
export default class CreateRecipePage extends React.PureComponent {
  static propTypes = {
    createRecipe: PropTypes.func.isRequired,
    history: PropTypes.object.isRequired,
  };

  onFormFailure(err) {
    handleError('Recipe cannot be created.', err);
  }

  onFormSuccess(newId) {
    message.success('Recipe created');
    this.props.history.push(`${NormandyLink.PREFIX}/recipe/${newId}/`);
  }

  async formAction(formValues) {
    return this.props.createRecipe(formValues);
  }

  render() {
    return (
      <div>
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

import { message, Spin } from 'antd';
import autobind from 'autobind-decorator';
import { Map } from 'immutable';
import { push } from 'connected-react-router';
import PropTypes from 'prop-types';
import React from 'react';
import { connect } from 'react-redux';

import AuthenticationAlert from 'console/components/common/AuthenticationAlert';
import QueryExperiment from 'console/components/data/QueryExperiment';
import { getUserProfile } from 'console/state/auth/selectors';
import handleError from 'console/utils/handleError';
import GenericFormContainer from 'console/workflows/recipes/components/GenericFormContainer';
import RecipeForm, { cleanRecipeData } from 'console/workflows/recipes/components/RecipeForm';
import { createRecipe } from 'console/state/recipes/actions';
import { getExperimentRecipeData } from 'console/state/recipes/selectors';
import { getUrlParam } from 'console/state/router/selectors';
import { reverse } from 'console/urls';

@connect(
  state => {
    const experimentSlug = getUrlParam(state, 'experimentSlug');

    let experimentRecipeData;
    if (experimentSlug) {
      experimentRecipeData = getExperimentRecipeData(state, experimentSlug);
    }

    return {
      userProfile: getUserProfile(state),
      experimentRecipeData,
      experimentSlug,
    };
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
    experimentRecipeData: PropTypes.instanceOf(Map),
    experimentSlug: PropTypes.string,
    push: PropTypes.func.isRequired,
    userProfile: PropTypes.instanceOf(Map),
  };

  static defaultProps = {
    userProfile: null,
  };

  onFormFailure(err) {
    handleError(`Recipe cannot be created: ${err.data}`, err);
  }

  onFormSuccess(recipeId) {
    message.success('Recipe created');
    this.props.push(reverse('recipes.details', { recipeId }));
  }

  async formAction(data) {
    const { comment, ...recipeData } = data;
    const cleanedData = cleanRecipeData(recipeData);

    if (comment) {
      const err = new Error();
      err.data = 'Empty the comment field to continue.';
      throw err;
    }

    return this.props.createRecipe(cleanedData);
  }

  renderForm() {
    const { experimentRecipeData, experimentSlug } = this.props;

    if (experimentSlug && !experimentRecipeData) {
      return <Spin />;
    }

    return (
      <GenericFormContainer
        form={RecipeForm}
        formAction={this.formAction}
        onSuccess={this.onFormSuccess}
        onFailure={this.onFormFailure}
        formProps={{
          isCreationForm: true,
          isImportForm: !!experimentSlug,
          revision: experimentRecipeData,
        }}
      />
    );
  }

  render() {
    const { experimentSlug, userProfile } = this.props;

    if (!userProfile) {
      return (
        <div className="content-wrapper">
          <AuthenticationAlert
            type="error"
            description="You must be logged in to create a recipe."
          />
        </div>
      );
    }
    return (
      <div className="content-wrapper">
        {experimentSlug ? <QueryExperiment slug={experimentSlug} /> : null}
        <h2>{experimentSlug ? 'Import Recipe' : 'Create New Recipe'}</h2>
        {this.renderForm()}
      </div>
    );
  }
}

export default CreateRecipePage;

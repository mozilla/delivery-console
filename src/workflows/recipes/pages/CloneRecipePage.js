import { Alert, message } from 'antd';
import autobind from 'autobind-decorator';
import { push } from 'connected-react-router';
import { Map } from 'immutable';
import PropTypes from 'prop-types';
import React from 'react';
import { connect } from 'react-redux';
import { NavLink } from 'react-router-dom';

import { getUserProfile } from 'console/state/auth/selectors';
import GenericFormContainer from 'console/workflows/recipes/components/GenericFormContainer';
import handleError from 'console/utils/handleError';
import LoadingOverlay from 'console/components/common/LoadingOverlay';
import RecipeForm, { cleanRecipeData } from 'console/workflows/recipes/components/RecipeForm';
import QueryRecipe from 'console/components/data/QueryRecipe';
import QueryRevision from 'console/components/data/QueryRevision';
import { createRecipe } from 'console/state/recipes/actions';
import { getUrlParamAsInt } from 'console/state/router/selectors';
import {
  getRecipeForRevision,
  isLatestRevision as isLatestRevisionSelector,
} from 'console/state/revisions/selectors';
import { getLatestRevisionIdForRecipe } from 'console/state/recipes/selectors';
import { reverse } from 'console/urls';

@connect(
  (state, props) => {
    const recipeId = getUrlParamAsInt(state, 'recipeId');
    const latestRevisionId = getLatestRevisionIdForRecipe(state, recipeId, '');
    const revisionId = getUrlParamAsInt(state, 'revisionId', latestRevisionId);
    const recipe = getRecipeForRevision(state, revisionId, new Map());
    const isLatestRevision = isLatestRevisionSelector(state, revisionId);

    return {
      isLatestRevision,
      recipe,
      recipeId,
      revisionId,
      userProfile: getUserProfile(state),
    };
  },
  {
    createRecipe,
    push,
  },
)
@autobind
class CloneRecipePage extends React.PureComponent {
  static propTypes = {
    createRecipe: PropTypes.func.isRequired,
    isLatestRevision: PropTypes.bool.isRequired,
    recipeId: PropTypes.number.isRequired,
    recipe: PropTypes.instanceOf(Map).isRequired,
    revisionId: PropTypes.number.isRequired,
    userProfile: PropTypes.instanceOf(Map),
  };

  static defaultProps = {
    userProfile: null,
  };

  onFormSuccess(recipeId) {
    message.success('Recipe saved');
    this.props.push(reverse('recipes.details', { recipeId }));
  }

  onFormFailure(err) {
    handleError('Recipe cannot be cloned.', err);
  }

  getFormProps() {
    const { recipe } = this.props;

    // Remove the 'name' and 'identicon' field values.
    const displayedRecipe = recipe.remove('name').remove('identicon_seed');

    return {
      recipe: displayedRecipe,
      isCreationForm: true,
    };
  }

  async formAction(data) {
    const cleanedData = cleanRecipeData(data);
    return this.props.createRecipe(cleanedData);
  }

  renderHeader() {
    const { isLatestRevision, recipe, recipeId, revisionId } = this.props;

    const recipeDetailsURL = isLatestRevision
      ? reverse('recipes.details', { recipeId })
      : reverse('recipes.revision', { recipeId, revisionId });

    const recipeName = recipe.get('name');

    // Only display revision hash if we're _not_ on the latest version.
    const revisionAddendum = isLatestRevision ? '' : `(Revision: ${revisionId})`;
    const cloningMessage = `Cloning recipe values from "${recipeName}" ${revisionAddendum}`;

    return (
      <span>
        <h2>Clone Recipe</h2>
        {recipeName && (
          <NavLink to={recipeDetailsURL}>
            <Alert message={cloningMessage} type="info" showIcon />
          </NavLink>
        )}
      </span>
    );
  }

  render() {
    const { recipeId, revisionId, userProfile } = this.props;

    if (!userProfile) {
      return (
        <div className="content-wrapper">
          <Alert
            type="error"
            message="Not logged in"
            description="You must be logged in to clone this recipe."
          />
        </div>
      );
    }

    return (
      <div className="content-wrapper clone-page">
        <QueryRecipe pk={recipeId} />
        <QueryRevision pk={revisionId} />
        {this.renderHeader()}

        <LoadingOverlay requestIds={[`fetch-recipe-${recipeId}`, `fetch-revision-${revisionId}`]}>
          <GenericFormContainer
            form={RecipeForm}
            formAction={this.formAction}
            onSuccess={this.onFormSuccess}
            onFailure={this.onFormFailure}
            formProps={this.getFormProps()}
            key={revisionId}
          />
        </LoadingOverlay>
      </div>
    );
  }
}

export default CloneRecipePage;

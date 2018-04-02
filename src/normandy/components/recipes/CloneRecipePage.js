import { Alert, message } from 'antd';
import autobind from 'autobind-decorator';
import { Map } from 'immutable';
import PropTypes from 'prop-types';
import React from 'react';
import { connect } from 'react-redux';
import { Link, push as pushAction } from 'redux-little-router';

import GenericFormContainer from 'normandy/components/recipes/GenericFormContainer';
import handleError from 'normandy/utils/handleError';
import LoadingOverlay from 'normandy/components/common/LoadingOverlay';
import RecipeForm from 'normandy/components/recipes/RecipeForm';
import QueryRecipe from 'normandy/components/data/QueryRecipe';
import QueryRevision from 'normandy/components/data/QueryRevision';
import { createRecipe as createAction } from 'normandy/state/app/recipes/actions';
import { getUrlParam, getUrlParamAsInt } from 'normandy/state/router/selectors';
import {
  getRecipeForRevision,
  isLatestRevision as isLatestRevisionSelector,
} from 'normandy/state/app/revisions/selectors';
import { getLatestRevisionIdForRecipe } from 'normandy/state/app/recipes/selectors';

@connect(
  state => {
    const recipeId = getUrlParamAsInt(state, 'recipeId');
    const latestRevisionId = getLatestRevisionIdForRecipe(state, recipeId, '');
    const revisionId = getUrlParam(state, 'revisionId', latestRevisionId);
    const recipe = getRecipeForRevision(state, revisionId, new Map());
    const isLatestRevision = isLatestRevisionSelector(state, revisionId);

    return {
      isLatestRevision,
      recipe,
      recipeId,
      revisionId,
    };
  },
  {
    push: pushAction,
    createRecipe: createAction,
  },
)
@autobind
export default class CloneRecipePage extends React.PureComponent {
  static propTypes = {
    push: PropTypes.func.isRequired,
    createRecipe: PropTypes.func.isRequired,
    isLatestRevision: PropTypes.bool.isRequired,
    recipeId: PropTypes.number.isRequired,
    recipe: PropTypes.instanceOf(Map).isRequired,
    revisionId: PropTypes.string.isRequired,
  };

  onFormSuccess(newId) {
    message.success('Recipe saved');
    this.props.push(`/recipe/${newId}/`);
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

  async formAction(values) {
    return this.props.createRecipe(values);
  }

  renderHeader() {
    const { isLatestRevision, recipe, recipeId, revisionId } = this.props;

    const recipeDetailsURL = `/recipe/${recipeId}${
      isLatestRevision ? '' : `/rev/${revisionId}`
    }/`;

    const recipeName = recipe.get('name');

    // Only display revision hash if we're _not_ on the latest version.
    const revisionAddendum = isLatestRevision
      ? ''
      : `(Revision: ${revisionId.slice(0, 7)})`;
    const cloningMessage = `Cloning recipe values from "${recipeName}" ${revisionAddendum}`;

    return (
      <span>
        <h2>Clone Recipe</h2>
        {recipeName && (
          <Link href={recipeDetailsURL}>
            <Alert message={cloningMessage} type="info" showIcon />
          </Link>
        )}
      </span>
    );
  }

  render() {
    const { recipeId, revisionId } = this.props;

    return (
      <div className="clone-page">
        <QueryRecipe pk={recipeId} />
        <QueryRevision pk={revisionId} />
        {this.renderHeader()}

        <LoadingOverlay
          requestIds={[
            `fetch-recipe-${recipeId}`,
            `fetch-revision-${revisionId}`,
          ]}
        >
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

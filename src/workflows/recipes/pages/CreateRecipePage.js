import { message } from 'antd';
import autobind from 'autobind-decorator';
import { Map } from 'immutable';
import { push } from 'connected-react-router';
import PropTypes from 'prop-types';
import React from 'react';
import { connect } from 'react-redux';

import AuthenticationAlert from 'console/components/common/AuthenticationAlert';
import VPNAlert from 'console/components/common/VPNAlert';
import { getUserProfile } from 'console/state/auth/selectors';
import { isNormandyAdminAvailable } from 'console/state/network/selectors';
import handleError from 'console/utils/handleError';
import GenericFormContainer from 'console/workflows/recipes/components/GenericFormContainer';
import RecipeForm, { cleanRecipeData } from 'console/workflows/recipes/components/RecipeForm';
import { createRecipe } from 'console/state/recipes/actions';
import { reverse } from 'console/urls';

@connect(
  state => {
    return { userProfile: getUserProfile(state), vpnAvailable: isNormandyAdminAvailable(state) };
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
    vpnAvailable: PropTypes.bool,
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
    const { userProfile, vpnAvailable } = this.props;

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
    if (vpnAvailable === false) {
      return (
        <div className="content-wrapper">
          <VPNAlert type="error" description="You must be on the VPN to create a recipe." />
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

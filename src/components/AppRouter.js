import React from 'react';
import { Switch } from 'react-router-dom';
import { Route } from 'react-router';

import CreateExtensionPage from 'console/components/pages/extensions/CreateExtensionPage';
import EditExtensionPage from 'console/components/pages/extensions/EditExtensionPage';
import ApprovalHistoryPage from 'console/components/pages/recipes/ApprovalHistoryPage';
import CreateRecipePage from 'console/components/pages/recipes/CreateRecipePage';
import CloneRecipePage from 'console/components/pages/recipes/CloneRecipePage';
import EditRecipePage from 'console/components/pages/recipes/EditRecipePage';
import ExtensionListingPage from 'console/components/pages/extensions/ExtensionListingPage';
import RecipeListingPage from 'console/components/pages/recipes/RecipeListingPage';
import RecipeDetailPage from 'console/components/pages/recipes/RecipeDetailPage';
import MissingPage from 'console/components/pages/MissingPage';

const Homepage = props => (
  <div>
    <h3>Welcome {props.userInfo ? 'back' : 'home'}!</h3>
    {props.userInfo ? (
      <p>Hello there!</p>
    ) : (
      <p>You are not logged in! Please use the login button in the header.</p>
    )}
  </div>
);

export default class AppRouter extends React.Component {
  state = {};

  getRoutes() {
    return {
      '/': {
        component: () => <Homepage userInfo={this.state.userInfo} />,
      },
      // Recipes ---
      '/recipe': {
        component: RecipeListingPage,
      },
      '/recipe/new': {
        component: CreateRecipePage,
      },
      '/recipe/:recipeId': {
        component: RecipeDetailPage,
      },
      '/recipe/:recipeId/edit': {
        component: EditRecipePage,
      },
      '/recipe/:recipeId/approval_history': {
        component: ApprovalHistoryPage,
      },
      '/recipe/:recipeId/clone': {
        component: CloneRecipePage,
      },
      // Recipe Revisions ---
      '/recipe/:recipeId/rev/:revisionId': {
        component: RecipeDetailPage,
      },
      '/recipe/:recipeId/rev/:revisionId/clone': {
        component: CloneRecipePage,
      },
      // Extensions ---
      '/extension': {
        component: ExtensionListingPage,
      },
      '/extension/new': {
        component: CreateExtensionPage,
      },
      '/extension/:extensionId': {
        component: EditExtensionPage,
      },
    };
  }

  render() {
    const routes = this.getRoutes();
    return (
      <Switch>
        {Object.keys(routes).map(route => {
          return <Route key={route} exact path={route} {...routes[route]} />;
        })}

        <Route component={MissingPage} />
      </Switch>
    );
  }
}

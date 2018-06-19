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
import HomePage from 'console/components/pages/HomePage';

export default class AppRouter extends React.Component {
  getRoutes() {
    return {
      '/': {
        component: HomePage,
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

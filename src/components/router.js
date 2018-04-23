import React from 'react';
import { Switch } from 'react-router-dom';
import { Route } from 'react-router';

import CreateExtensionPage from 'console/components/extensions/CreateExtensionPage';
import EditExtensionPage from 'console/components/extensions/EditExtensionPage';
import ApprovalHistoryPage from 'console/components/recipes/ApprovalHistoryPage';
import CreateRecipePage from 'console/components/recipes/CreateRecipePage';
import CloneRecipePage from 'console/components/recipes/CloneRecipePage';
import EditRecipePage from 'console/components/recipes/EditRecipePage';
import ExtensionListing from 'console/components/extensions/ExtensionListing';
import RecipeListing from 'console/components/recipes/RecipeListing';
import RecipeDetailPage from 'console/components/recipes/RecipeDetailPage';

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

export default class ConsoleRouter extends React.Component {
  state = {};

  getRoutes() {
    return {
      '/': {
        component: () => <Homepage userInfo={this.state.userInfo} />,
      },
      // Recipes ---
      '/recipe': {
        component: RecipeListing,
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
        component: ExtensionListing,
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

        <Route
          component={({ location }) => (
            <div>
              <h2>404 - Page Not Found</h2>
              <p>
                No route match for <code>{location.pathname}</code>
              </p>
            </div>
          )}
        />
      </Switch>
    );
  }
}

import React from 'react';
import { Switch } from 'react-router-dom';
import { Route } from 'react-router';

import CreateExtensionPage from 'normandy/components/extensions/CreateExtensionPage';
import EditExtensionPage from 'normandy/components/extensions/EditExtensionPage';
import ApprovalHistoryPage from 'normandy/components/recipes/ApprovalHistoryPage';
import CreateRecipePage from 'normandy/components/recipes/CreateRecipePage';
import CloneRecipePage from 'normandy/components/recipes/CloneRecipePage';
import EditRecipePage from 'normandy/components/recipes/EditRecipePage';
import ExtensionListing from 'normandy/components/extensions/ExtensionListing';
import Gateway from 'normandy/components/pages/Gateway';
import RecipeListing from 'normandy/components/recipes/RecipeListing';
import MissingPage from 'normandy/components/pages/MissingPage';
import RecipeDetailPage from 'normandy/components/recipes/RecipeDetailPage';

import { NavLink } from 'react-router-dom';

export default class NormandyRouter extends React.Component {
  static ROUTES = {
    '/': {
      component: Gateway,
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
    }
  };

  componentWillMount(){
    // `NormandyLinks` are wrapped Links which append a prefix for nested apps.
    // At this point we know the prefix, so we can update all instances of the
    // Link here via the static PREFIX property.
    NormandyLink.PREFIX = this.props.urlPrefix || '';
  }

  render() {
    const urlPrefix = this.props.urlPrefix || '';

    return (
      <Switch>
        {
          Object.keys(NormandyRouter.ROUTES).map(route => {
            return <Route key={route} exact path={`${urlPrefix}${route}`} {...NormandyRouter.ROUTES[route]} />;
          })
        }

        <Route component={({ location }) => (
          <div>
            <h2>404 - Page Not Found</h2>
            <p>No normandy match for <code>{location.pathname}</code></p>
          </div>
        )} />
      </Switch>
    );
  }
}

export class NormandyLink extends React.Component {
  static PREFIX = '';
  render() {
    const {
      to,
      ...rest,
    } = this.props;

    return (<NavLink to={`${NormandyLink.PREFIX}${to}`} {...rest} />);
  }
}

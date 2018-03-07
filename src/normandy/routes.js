import PropTypes from 'prop-types';
import React from 'react';
import { connect } from 'react-redux';
import { routerForBrowser } from 'redux-little-router';

import App from 'normandy/components/App';
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

import { searchRouteTree, replaceUrlVariables } from './routerUtils';


/**
 * @type {Route}
 * @property {Component} component    React component used to render route
 * @property {String}    crumb        Displayed text on navigational breadcrumbs
 * @property {String}    slug         Internal route name
 * @property {String}    sessionSlug  Optional replacement slug used with session history.
 * @property {Route}     '/[...]'     Optional nested route tree(s).
 */

const routes = {
  '/': {
    component: Gateway,
    crumb: 'Home',
    slug: 'home',

    '/recipe': {
      crumb: 'Recipes Listing',

      '/': {
        component: RecipeListing,
        slug: 'recipe-listing',
      },

      '/new': {
        crumb: 'New Recipe',

        '/': {
          component: CreateRecipePage,
          slug: 'recipe-new',
        },
      },

      '/:recipeId': {
        crumb: 'View Recipe',

        '/': {
          component: RecipeDetailPage,
          slug: 'recipe-view',
        },

        '/rev/:revisionId': {
          crumb: 'Revision',

          '/': {
            component: RecipeDetailPage,
            sessionSlug: 'recipe-view',
            slug: 'recipe-revision',
          },

          '/clone': {
            crumb: 'Clone Revision',

            '/': {
              component: CloneRecipePage,
              sessionSlug: 'recipe-view',
              slug: 'recipe-revision-clone',
            },
          },
        },

        '/edit': {
          crumb: 'Edit Recipe',

          '/': {
            component: EditRecipePage,
            sessionSlug: 'recipe-view',
            slug: 'recipe-edit',
          },
        },

        '/approval_history': {
          crumb: 'Approval History',

          '/': {
            component: ApprovalHistoryPage,
            sessionSlug: 'recipe-view',
            slug: 'recipe-approval-history',
          },
        },

        '/clone': {
          crumb: 'Clone Recipe',

          '/': {
            component: CloneRecipePage,
            sessionSlug: 'recipe-view',
            slug: 'recipe-clone',
          },
        },
      },
    },

    '/extension': {
      crumb: 'Extensions Listing',

      '/': {
        component: ExtensionListing,
        slug: 'extension-listing',
      },

      '/new': {
        crumb: 'New Extension',

        '/': {
          component: CreateExtensionPage,
          slug: 'extension-new',
        },
      },

      '/:extensionId': {
        crumb: 'Edit Extension',

        '/': {
          component: EditExtensionPage,
          slug: 'extension-edit',
        },
      },
    },
  },
};

export const getNamedRoute = (name, params = {}) => {
  const url = searchRouteTree(routes, name);
  if (url) {
    return replaceUrlVariables(url, params);
  }
  return null;
};

export const {
  reducer,
  middleware,
  enhancer,
} = routerForBrowser({
  routes,
  basename: '',
});

@connect(state => ({
  router: state.router,
}))
export default class Router extends React.PureComponent {
  static propTypes = {
    router: PropTypes.object.isRequired,
  };

  render() {
    const { router } = this.props;
    const content = router.route ? <router.result.component /> : <MissingPage />;
    return <App>{content}</App>;
  }
}

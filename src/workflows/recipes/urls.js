import ApprovalHistoryPage from 'console/components/pages/recipes/ApprovalHistoryPage';
import CreateRecipePage from 'console/components/pages/recipes/CreateRecipePage';
import CloneRecipePage from 'console/components/pages/recipes/CloneRecipePage';
import EditRecipePage from 'console/components/pages/recipes/EditRecipePage';
import RecipeListingPage from 'console/components/pages/recipes/RecipeListingPage';
import RecipeDetailPage from 'console/components/pages/recipes/RecipeDetailPage';
import { getRevisionFromUrl } from 'console/state/router/selectors';
import { Map } from 'immutable';

export default {
  '/recipe': {
    name: 'recipes',
    component: RecipeListingPage,
    crumbText: 'Recipes',
    documentTitle: 'Recipes',
    cardOnHomepage: {
      title: 'Recipes',
      description: 'SHIELD recipes',
    },
    routes: {
      '/new': {
        name: 'recipes.new',
        component: CreateRecipePage,
        crumbText: 'New',
        documentTitle: 'New Recipe',
      },
      '/:recipeId': {
        name: 'recipes.details',
        component: RecipeDetailPage,
        crumbText: 'Details',
        documentTitle: state => {
          const recipe = getRevisionFromUrl(state, new Map()).get('recipe');
          return ['Recipe Details', recipe && `#${recipe.get('id')} ${recipe.get('name')}`];
        },
        routes: {
          '/edit': {
            name: 'recipes.edit',
            component: EditRecipePage,
            crumbText: 'Edit',
            documentTitle: state => {
              const recipe = getRevisionFromUrl(state, new Map()).get('recipe');
              return ['Edit Recipe', recipe && `#${recipe.get('id')} ${recipe.get('name')}`];
            },
          },
          '/approval_history': {
            name: 'recipes.approval_history',
            component: ApprovalHistoryPage,
            crumbText: 'Approval History',
            documentTitle: state => {
              const recipe = getRevisionFromUrl(state, new Map()).get('recipe');
              return [
                'Recipe Approval History',
                recipe && `#${recipe.get('id')} ${recipe.get('name')}`,
              ];
            },
          },
          '/clone': {
            name: 'recipes.clone',
            component: CloneRecipePage,
            crumbText: 'Clone',
            documentTitle: 'Clone Recipe',
          },
          '/rev/:revisionId': {
            name: 'recipes.revision',
            component: RecipeDetailPage,
            crumbText: 'Revision Details',
            documentTitle: state => {
              const revision = getRevisionFromUrl(state);
              return [
                'Recipe Revision',
                revision && `#${revision.getIn(['recipe', 'id'])} rev ${revision.get('id')}`,
                revision && `${revision.getIn(['recipe', 'name'])}`,
              ];
            },
            routes: {
              '/clone': {
                name: 'recipes.revision.clone',
                component: CloneRecipePage,
                crumbText: 'Clone',
              },
            },
          },
        },
      },
    },
  },
};

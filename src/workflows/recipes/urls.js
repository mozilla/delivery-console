import ApprovalHistoryPage from 'console/workflows/recipes/pages/ApprovalHistoryPage';
import CreateRecipePage from 'console/workflows/recipes/pages/CreateRecipePage';
import CloneRecipePage from 'console/workflows/recipes/pages/CloneRecipePage';
import EditRecipePage from 'console/workflows/recipes/pages/EditRecipePage';
import RecipeListingPage from 'console/workflows/recipes/pages/RecipeListingPage';
import RecipeDetailPage from 'console/workflows/recipes/pages/RecipeDetailPage';
import { getRevisionFromUrl } from 'console/state/router/selectors';
import { getCurrentRevisionForRecipe } from 'console/state/recipes/selectors';
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
          const recipeId = getRevisionFromUrl(state, new Map()).getIn(['recipe', 'id']);
          const revision = getCurrentRevisionForRecipe(state, recipeId);
          return ['Recipe Details', revision && `#${recipeId} ${revision.get('name')}`];
        },
        routes: {
          '/edit': {
            name: 'recipes.edit',
            component: EditRecipePage,
            crumbText: 'Edit',
            documentTitle: state => {
              const recipeId = getRevisionFromUrl(state, new Map()).getIn(['recipe', 'id']);
              const revision = getCurrentRevisionForRecipe(state, recipeId);
              return ['Edit Recipe', revision && `#${recipeId} ${revision.get('name')}`];
            },
          },
          '/approval_history': {
            name: 'recipes.approval_history',
            component: ApprovalHistoryPage,
            crumbText: 'Approval History',
            documentTitle: state => {
              const recipeId = getRevisionFromUrl(state, new Map()).getIn(['recipe', 'id']);
              const revision = getCurrentRevisionForRecipe(state, recipeId);
              return [
                'Recipe Approval History',
                revision && `#${recipeId} ${revision.get('name')}`,
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
              const revision = getRevisionFromUrl(state, new Map());
              const recipeId = revision.getIn(['recipe', 'id']);
              const currentRevision = getCurrentRevisionForRecipe(state, recipeId);
              return [
                'Recipe Revision',
                revision && `#${recipeId} rev ${revision.get('id')}`,
                currentRevision && `${currentRevision.get('name')}`,
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

import ApprovalHistoryPage from 'console/components/pages/recipes/ApprovalHistoryPage';
import CreateRecipePage from 'console/components/pages/recipes/CreateRecipePage';
import CloneRecipePage from 'console/components/pages/recipes/CloneRecipePage';
import EditRecipePage from 'console/components/pages/recipes/EditRecipePage';
import RecipeListingPage from 'console/components/pages/recipes/RecipeListingPage';
import RecipeDetailPage from 'console/components/pages/recipes/RecipeDetailPage';

export default {
  '/recipe': {
    component: RecipeListingPage,
    routes: {
      '/new': {
        component: CreateRecipePage,
      },
      '/:recipeId': {
        component: RecipeDetailPage,
        routes: {
          '/edit': {
            component: EditRecipePage,
          },
          '/approval_history': {
            component: ApprovalHistoryPage,
          },
          '/clone': {
            component: CloneRecipePage,
          },
          '/rev/:revisionId': {
            component: RecipeDetailPage,
            routes: {
              '/clone': {
                component: CloneRecipePage,
              },
            },
          },
        },
      },
    },
  },
};

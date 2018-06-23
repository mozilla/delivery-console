import ApprovalHistoryPage from 'console/components/pages/recipes/ApprovalHistoryPage';
import CreateRecipePage from 'console/components/pages/recipes/CreateRecipePage';
import CloneRecipePage from 'console/components/pages/recipes/CloneRecipePage';
import EditRecipePage from 'console/components/pages/recipes/EditRecipePage';
import RecipeListingPage from 'console/components/pages/recipes/RecipeListingPage';
import RecipeDetailPage from 'console/components/pages/recipes/RecipeDetailPage';

export default {
  '/recipe': {
    component: RecipeListingPage,
    crumbText: 'Recipes',
    routes: {
      '/new': {
        component: CreateRecipePage,
        crumbText: 'New',
      },
      '/:recipeId': {
        component: RecipeDetailPage,
        crumbText: 'Details',
        routes: {
          '/edit': {
            component: EditRecipePage,
            crumbText: 'Edit',
          },
          '/approval_history': {
            component: ApprovalHistoryPage,
            crumbText: 'Approval History',
          },
          '/clone': {
            component: CloneRecipePage,
            crumbText: 'Clone',
          },
          '/rev/:revisionId': {
            component: RecipeDetailPage,
            crumbText: 'Revision Details',
            routes: {
              '/clone': {
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

import ApprovalHistoryPage from 'console/components/pages/recipes/ApprovalHistoryPage';
import CreateRecipePage from 'console/components/pages/recipes/CreateRecipePage';
import CloneRecipePage from 'console/components/pages/recipes/CloneRecipePage';
import EditRecipePage from 'console/components/pages/recipes/EditRecipePage';
import RecipeListingPage from 'console/components/pages/recipes/RecipeListingPage';
import RecipeDetailPage from 'console/components/pages/recipes/RecipeDetailPage';

export default {
  '/recipe': {
    name: 'recipes',
    component: RecipeListingPage,
    crumbText: 'Recipes',
    cardOnHomepage: {
      title: 'Recipes',
      description: 'SHIELD recipes',
    },
    routes: {
      '/new': {
        name: 'recipes.new',
        component: CreateRecipePage,
        crumbText: 'New',
      },
      '/:recipeId': {
        name: 'recipes.details',
        component: RecipeDetailPage,
        crumbText: 'Details',
        routes: {
          '/edit': {
            name: 'recipes.edit',
            component: EditRecipePage,
            crumbText: 'Edit',
          },
          '/approval_history': {
            name: 'recipes.approval_history',
            component: ApprovalHistoryPage,
            crumbText: 'Approval History',
          },
          '/clone': {
            name: 'recipes.clone',
            component: CloneRecipePage,
            crumbText: 'Clone',
          },
          '/rev/:revisionId': {
            name: 'recipes.revision',
            component: RecipeDetailPage,
            crumbText: 'Revision Details',
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

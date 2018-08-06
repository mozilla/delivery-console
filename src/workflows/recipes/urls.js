import ApprovalHistoryPage from 'console/workflows/recipes/pages/ApprovalHistoryPage';
import CreateRecipePage from 'console/workflows/recipes/pages/CreateRecipePage';
import CloneRecipePage from 'console/workflows/recipes/pages/CloneRecipePage';
import EditRecipePage from 'console/workflows/recipes/pages/EditRecipePage';
import RecipeListingPage from 'console/workflows/recipes/pages/RecipeListingPage';
import RecipeDetailPage from 'console/workflows/recipes/pages/RecipeDetailPage';

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
        documentTitle: 'Recipe Details',
        routes: {
          '/edit': {
            name: 'recipes.edit',
            component: EditRecipePage,
            crumbText: 'Edit',
            documentTitle: 'Edit Recipe',
          },
          '/approval_history': {
            name: 'recipes.approval_history',
            component: ApprovalHistoryPage,
            crumbText: 'Approval History',
            documentTitle: 'Recipe Approval History',
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
            documentTitle: 'Recipe Revision Details',
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

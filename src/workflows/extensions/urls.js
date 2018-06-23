import CreateExtensionPage from 'console/components/pages/extensions/CreateExtensionPage';
import EditExtensionPage from 'console/components/pages/extensions/EditExtensionPage';
import ExtensionListingPage from 'console/components/pages/extensions/ExtensionListingPage';

export default {
  '/extension': {
    component: ExtensionListingPage,
    crumbText: 'Extensions',
    routes: {
      '/new': {
        component: CreateExtensionPage,
        crumbText: 'New',
      },
      '/:extensionId': {
        component: EditExtensionPage,
        crumbText: 'Edit',
      },
    },
  },
};

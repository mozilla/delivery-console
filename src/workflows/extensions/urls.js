import CreateExtensionPage from 'console/components/pages/extensions/CreateExtensionPage';
import EditExtensionPage from 'console/components/pages/extensions/EditExtensionPage';
import ExtensionListingPage from 'console/components/pages/extensions/ExtensionListingPage';

export default {
  '/extension': {
    name: 'extensions',
    component: ExtensionListingPage,
    crumbText: 'Extensions',
    documentTitle: 'Extensions',
    cardOnHomepage: {
      title: 'Extensions',
      description: 'Web-extensions',
    },
    routes: {
      '/new': {
        name: 'extensions.new',
        component: CreateExtensionPage,
        crumbText: 'New',
        documentTitle: 'New Extension',
      },
      '/:extensionId': {
        name: 'extensions.edit',
        component: EditExtensionPage,
        crumbText: 'Edit',
        documentTitle: 'Edit Extension',
      },
    },
  },
};

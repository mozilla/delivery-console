import { reduceUrlsToRoutesList } from 'console/utils/router';

describe('Router utils', () => {
  it('should work', () => {
    const urls = {
      '/': {
        component: 'Component',
        routes: {
          '/secondary': {
            component: 'Component',
            crumbText: 'crumb',
            exact: false,
          },
        },
      },
    };

    expect(reduceUrlsToRoutesList(urls)).toEqual([
      {
        path: '/',
        component: 'Component',
        exact: true,
        parentPath: null,
      },
      {
        path: '/secondary/',
        component: 'Component',
        crumbText: 'crumb',
        exact: false,
        parentPath: '/',
      },
    ]);
  });
});

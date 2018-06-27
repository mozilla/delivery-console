import { reduceUrlsToRoutesList, replaceParamsInPath } from 'console/utils/router';

describe('Router utils:', () => {
  describe('reduceUrlsToRoutesList', () => {
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

  describe('replaceParamsInPath', () => {
    it('should work', () => {
      expect(replaceParamsInPath('/:a/:b/', { a: '1', b: '2' })).toBe('/1/2/');
    });
  });
});

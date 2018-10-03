import { fetchRecipeFilters } from 'console/state/recipes/actions';

describe('Actions', () => {
  describe('fetchRecipeFilters action', () => {
    it('should work (and update) on an empty localStorage', async () => {
      const fakeFilters = { countries: [] };
      let state = {};
      let dispatches = 0;
      const dispatcher = action => {
        if (typeof action === 'function') {
          // Let's pretend we call out to the network.
          return fakeFilters;
        }
        dispatches++;
        state = action;
      };
      const func = fetchRecipeFilters();
      await func(dispatcher);
      expect(state.filters).toEqual(fakeFilters);
      expect(dispatches).toEqual(1);
      expect(JSON.parse(global.localStorage.getItem('recipe_filters'))).toEqual(fakeFilters);
    });

    it('should update existing localStorage', async () => {
      global.localStorage.setItem('recipe_filters', JSON.stringify({ countries: [] }));
      const fakeFilters = { countries: [{ key: 'SE', value: 'Sweeeden' }] };
      let state = {};
      let dispatches = 0;
      const dispatcher = action => {
        if (typeof action === 'function') {
          // Let's pretend we call out to the network.
          return fakeFilters;
        }
        dispatches++;
        state = action;
      };
      const func = fetchRecipeFilters();
      await func(dispatcher);
      expect(state.filters).toEqual(fakeFilters);
      expect(dispatches).toEqual(2);
      expect(JSON.parse(global.localStorage.getItem('recipe_filters'))).toEqual(fakeFilters);
    });
  });
});

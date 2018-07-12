import { List } from 'immutable';
import TestComponent from 'console/components/pages/recipes/RecipeListingPage';

const { WrappedComponent: RecipeListingPage } = TestComponent;

describe('<RecipeListingPage>', () => {
  const props = {
    columns: new List(),
    count: null,
    fetchFilteredRecipesPage: () => {},
    getCurrentUrlAsObject: () => {},
    history: {},
    ordering: null,
    pageNumber: null,
    push: () => {},
    openNewWindow: () => {},
    recipes: new List(),
    searchText: null,
    status: null,
  };

  it('should work', () => {
    const wrapper = () => shallow(<RecipeListingPage {...props} />);

    expect(wrapper).not.toThrow();
  });
});

import { List } from 'immutable';
import TestComponent from 'console/components/recipes/RecipeListing';

const { WrappedComponent: RecipeListing } = TestComponent;

describe('<RecipeListing>', () => {
  const props = {
    columns: new List(),
    count: null,
    fetchFilteredRecipesPage: () => {},
    getCurrentURL: () => {},
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
    const wrapper = () => shallow(<RecipeListing {...props} />);

    expect(wrapper).not.toThrow();
  });
});

import { List, Map } from 'immutable';
import TestComponent from 'normandy/components/recipes/RecipeDetailPage';

const { WrappedComponent: RecipeDetailPage } = TestComponent;

describe('<RecipeDetailPage>', () => {
  const props = {
    history: new List(),
    recipeId: 123,
    revision: new Map(),
    revisionId: 'abc',
  };

  it('should work', () => {
    const wrapper = () => shallow(<RecipeDetailPage {...props} />);

    expect(wrapper).not.toThrow();
  });
});

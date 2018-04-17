import { Map } from 'immutable';
import TestComponent from 'console/components/recipes/CloneRecipePage';

const { WrappedComponent: CloneRecipePage } = TestComponent;

describe('<CloneRecipePage>', () => {
  const props = {
    createRecipe: () => {},
    isLatestRevision: false,
    recipeId: 123,
    recipe: new Map(),
    revisionId: 'abc',
  };

  it('should work', () => {
    const wrapper = () => shallow(<CloneRecipePage {...props} />);

    expect(wrapper).not.toThrow();
  });
});

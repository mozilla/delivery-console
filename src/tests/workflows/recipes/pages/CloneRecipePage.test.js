import { Map } from 'immutable';
import TestComponent from 'console/workflows/recipes/pages/CloneRecipePage';

const { WrappedComponent: CloneRecipePage } = TestComponent;

describe('<CloneRecipePage>', () => {
  const props = {
    createRecipe: () => {},
    currentRevision: new Map(),
    history: {},
    isLatestRevision: false,
    recipeId: 123,
    revisionId: 123,
  };

  it('should work', () => {
    const wrapper = () => shallow(<CloneRecipePage {...props} />);

    expect(wrapper).not.toThrow();
  });
});

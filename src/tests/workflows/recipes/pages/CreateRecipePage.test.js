import TestComponent from 'console/workflows/recipes/pages/CreateRecipePage';

const { WrappedComponent: CreateRecipePage } = TestComponent;

describe('<CreateRecipePage>', () => {
  const props = {
    createRecipe: () => {},
    push: () => {},
    history: {},
  };

  it('should work', () => {
    const wrapper = () => shallow(<CreateRecipePage {...props} />);

    expect(wrapper).not.toThrow();
  });
});

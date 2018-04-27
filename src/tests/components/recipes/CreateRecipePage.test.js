import TestComponent from 'console/components/recipes/CreateRecipePage';

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

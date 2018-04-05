import { Map } from 'immutable';
import RecipeForm from 'normandy/components/recipes/RecipeForm';

describe('<RecipeForm>', () => {
  const props = {
    form: {},
    isLoading: false,
    onSubmit: () => {},
    recipe: new Map(),
    selectedAction: new Map(),
  };

  it('should work', () => {
    const wrapper = () => shallow(<RecipeForm {...props} />);

    expect(wrapper).not.toThrow();
  });
});

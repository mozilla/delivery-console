import { Map, fromJS } from 'immutable';
import { ActionSelect as TestComponent } from 'normandy/components/recipes/RecipeForm';

const { WrappedComponent: ActionSelect } = TestComponent;

describe('<ActionSelect>', () => {
  const props = {
    actions: new Map(),
    value: '',
  };

  test('should work', () => {
    const wrapper = () => mount(<ActionSelect {...props} />);

    expect(wrapper).not.toThrow();
  });

  test('should handle actions with or without IDs', () => {
    const actions = fromJS({
      action1: { id: undefined, name: 'One' },
      action2: { id: null, name: 'Two' },
      action3: { name: 'Three' },
      action4: { id: 123, name: 'Four' },
    });

    const wrapper = () => mount(<ActionSelect actions={actions} />);
    expect(wrapper).not.toThrow();
  });
});

import { List } from 'immutable';
import NavigationMenu from 'normandy/components/common/NavigationMenu';

describe('<NavigationMenu>', () => {
  const props = {
    router: {},
    recipeSessionHistory: new List(),
    extensionSessionHistory: new List(),
    history: {},
  };

  test('should work', () => {
    const wrapper = () => shallow(<NavigationMenu {...props} />);

    expect(wrapper).not.toThrow();
  });
});

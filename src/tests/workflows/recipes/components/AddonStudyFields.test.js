import { List, Map } from 'immutable';
import AddonStudyFields from 'console/workflows/recipes/components/AddonStudyFields';

describe('<AddonStudyFields>', () => {
  const props = {
    disabled: false,
    extensions: new List(),
    recipeArguments: new Map(),
  };

  it('should work', () => {
    const wrapper = () => shallow(<AddonStudyFields {...props} />);

    expect(wrapper).not.toThrow();
  });
});

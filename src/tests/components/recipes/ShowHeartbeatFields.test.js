import { Map } from 'immutable';
import ShowHeartbeatFields from 'console/components/recipes/ShowHeartbeatFields';

describe('<ShowHeartbeatFields>', () => {
  const props = {
    disabled: false,
    form: {},
    recipeArguments: new Map(),
  };

  it('should work', () => {
    const wrapper = () => shallow(<ShowHeartbeatFields {...props} />);

    expect(wrapper).not.toThrow();
  });
});

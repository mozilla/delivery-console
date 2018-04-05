import { Map } from 'immutable';
import ShowHeartbeatFields from 'normandy/components/recipes/ShowHeartbeatFields';

describe('<ShowHeartbeatFields>', () => {
  const props = {
    disabled: false,
    recipeArguments: new Map(),
  };

  it('should work', () => {
    const wrapper = () => shallow(<ShowHeartbeatFields {...props} />);

    expect(wrapper).not.toThrow();
  });
});

import { Map } from 'immutable';
import React from 'react';
import { shallow } from 'enzyme';

import ConsoleLogFields from 'normandy/components/recipes/ConsoleLogFields';

describe('<ConsoleLogFields>', () => {
  const props = {
    disabled: false,
    recipeArguments: new Map(),
  };

  test('should work', () => {
    const wrapper = () => shallow(<ConsoleLogFields {...props} />);

    expect(wrapper).not.toThrow();
  });
});

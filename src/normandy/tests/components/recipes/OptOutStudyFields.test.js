import { List, Map } from 'immutable';
import React from 'react';

import OptOutStudyFields from 'normandy/components/recipes/OptOutStudyFields';

describe('<OptOutStudyFields>', () => {
  const props = {
    disabled: false,
    extensions: new List(),
    recipeArguments: new Map(),
  };

  test('should work', () => {
    const wrapper = () => shallow(<OptOutStudyFields {...props} />);

    expect(wrapper).not.toThrow();
  });
});

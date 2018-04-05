import React from 'react';
import { shallow } from 'enzyme';

import TestComponent from 'normandy/components/recipes/CreateRecipePage';

const { WrappedComponent: CreateRecipePage } = TestComponent;

describe('<CreateRecipePage>', () => {
  const props = {
    createRecipe: () => {},
    push: () => {},
  };

  test('should work', () => {
    const wrapper = () => shallow(<CreateRecipePage {...props} />);

    expect(wrapper).not.toThrow();
  });
});

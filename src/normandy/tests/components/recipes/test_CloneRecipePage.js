import { Map } from 'immutable';
import React from 'react';
import { shallow } from 'enzyme';

import TestComponent from 'normandy/components/recipes/CloneRecipePage';

const { WrappedComponent: CloneRecipePage } = TestComponent;

describe('<CloneRecipePage>', () => {
  const props = {
    createRecipe: () => {},
    isLatestRevision: false,
    recipeId: 123,
    recipe: new Map(),
    revisionId: 'abc',
  };

  test('should work', () => {
    const wrapper = () => shallow(<CloneRecipePage {...props} />);

    expect(wrapper).not.toThrow();
  });
});

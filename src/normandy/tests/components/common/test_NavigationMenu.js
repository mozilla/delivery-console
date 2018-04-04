import { List } from 'immutable';
import React from 'react';
import { shallow } from 'enzyme';

import NavigationMenu from 'normandy/components/common/NavigationMenu';

describe('<NavigationMenu>', () => {
  const props = {
    router: {},
    recipeSessionHistory: new List(),
    extensionSessionHistory: new List(),
    history: {},
  };

  it('should work', () => {
    const wrapper = () => shallow(<NavigationMenu {...props} />);

    expect(wrapper).not.toThrow();
  });
});

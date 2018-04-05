import React from 'react';

import BooleanIcon from 'normandy/components/common/BooleanIcon';

describe('<BooleanIcon>', () => {
  test('should work when true', () => {
    const wrapper = () => shallow(<BooleanIcon value />);

    expect(wrapper).not.toThrow();
  });

  test('should work when false', () => {
    const wrapper = () => shallow(<BooleanIcon value={false} />);

    expect(wrapper).not.toThrow();
  });
});

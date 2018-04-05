import React from 'react';

import CheckboxMenu from 'normandy/components/common/CheckboxMenu';

describe('<CheckboxMenu>', () => {
  const props = {
    checkboxes: [],
    label: '',
    onChange: () => {},
    options: [],
  };

  test('should work', () => {
    const wrapper = () => shallow(<CheckboxMenu {...props} />);

    expect(wrapper).not.toThrow();
  });
});

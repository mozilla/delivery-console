import React from 'react';

import MissingPage from 'normandy/components/pages/MissingPage';

describe('<MissingPage>', () => {
  test('should work', () => {
    const wrapper = () => shallow(<MissingPage />);

    expect(wrapper).not.toThrow();
  });
});

import React from 'react';
import { shallow } from 'enzyme';

import MissingPage from 'normandy/components/pages/MissingPage';

describe('<MissingPage>', () => {
  it('should work', () => {
    const wrapper = () => shallow(<MissingPage />);

    expect(wrapper).not.toThrow();
  });
});

import React from 'react';

import App from 'console/components/App';

describe('<App>', () => {
  const props = {
    children: <div>Hello</div>,
  };

  it('should work', () => {
    const wrapper = () => shallow(<App {...props} />);

    expect(wrapper).not.toThrow();
  });
});

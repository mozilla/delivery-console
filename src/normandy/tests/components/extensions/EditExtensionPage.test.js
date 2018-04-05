import React from 'react';

import QueryExtension from 'normandy/components/data/QueryExtension';
import TestComponent from 'normandy/components/extensions/EditExtensionPage';

const { WrappedComponent: EditExtensionPage } = TestComponent;

describe('<EditExtensionPage>', () => {
  const props = {
    extension: new Map(),
    extensionId: 123,
    updateExtension: () => Promise.resolve(),
  };

  test('should work', () => {
    const wrapper = () => shallow(<EditExtensionPage {...props} />);

    expect(wrapper).not.toThrow();
  });

  test('should have a QueryExtension component', () => {
    const wrapper = shallow(<EditExtensionPage {...props} />);
    expect(wrapper.find(QueryExtension).length).toBe(1);
  });
});

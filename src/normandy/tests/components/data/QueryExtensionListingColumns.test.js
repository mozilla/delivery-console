import React from 'react';
import { shallow, mount } from 'enzyme';

import TestComponent from 'normandy/components/data/QueryExtensionListingColumns';

const { WrappedComponent: QueryExtensionListingColumns } = TestComponent;

describe('<QueryExtensionListingColumns>', () => {
  const props = {
    loadExtensionListingColumns: () => {},
  };

  test('should work', () => {
    const wrapper = () => shallow(<QueryExtensionListingColumns {...props} />);

    expect(wrapper).not.toThrow();
  });

  test('should call loadExtensionListingColumns on mount', () => {
    let called = false;
    shallow(
      <QueryExtensionListingColumns
        loadExtensionListingColumns={() => {
          called = true;
        }}
      />,
    );

    expect(called).toBe(true);
  });

  test('should call loadExtensionListingColumns once if container props change', () => {
    let callCount = 0;
    const wrapper = mount(
      <div fakeProp={1}>
        <QueryExtensionListingColumns
          loadExtensionListingColumns={() => {
            callCount += 1;
          }}
        />
      </div>,
    );

    wrapper.setProps({ fakeProp: 2 });
    wrapper.setProps({ fakeProp: 3 });
    wrapper.setProps({ fakeProp: 4 });

    expect(callCount).toBe(1);
  });

  test('should not render anything', () => {
    const wrapper = shallow(<QueryExtensionListingColumns {...props} />);
    expect(wrapper.children().length).toBe(0);
  });
});

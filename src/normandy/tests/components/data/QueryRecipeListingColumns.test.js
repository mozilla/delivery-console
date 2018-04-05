import React from 'react';

import TestComponent from 'normandy/components/data/QueryRecipeListingColumns';

const { WrappedComponent: QueryRecipeListingColumns } = TestComponent;

describe('<QueryRecipeListingColumns>', () => {
  const props = {
    loadRecipeListingColumns: () => {},
  };

  test('should work', () => {
    const wrapper = () => shallow(<QueryRecipeListingColumns {...props} />);

    expect(wrapper).not.toThrow();
  });

  test('should call loadRecipeListingColumns on mount', () => {
    let called = false;
    shallow(
      <QueryRecipeListingColumns
        loadRecipeListingColumns={() => {
          called = true;
        }}
      />,
    );

    expect(called).toBe(true);
  });

  test('should call loadRecipeListingColumns once if container props change', () => {
    let callCount = 0;
    const wrapper = mount(
      <Stub fakeProp={1}>
        <QueryRecipeListingColumns
          loadRecipeListingColumns={() => {
            callCount += 1;
          }}
        />
      </Stub>,
    );

    wrapper.setProps({ fakeProp: 2 });
    wrapper.setProps({ fakeProp: 3 });
    wrapper.setProps({ fakeProp: 4 });

    expect(callCount).toBe(1);
  });

  test('should not render anything', () => {
    const wrapper = shallow(<QueryRecipeListingColumns {...props} />);
    expect(wrapper.children().length).toBe(0);
  });
});

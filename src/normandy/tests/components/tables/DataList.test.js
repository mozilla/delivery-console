import { List } from 'immutable';
import React from 'react';

import TestComponent from 'normandy/components/tables/DataList';

const { WrappedComponent: DataList } = TestComponent;

describe('<DataList>', () => {
  const props = {
    columnRenderers: {},
    columns: new List(),
    dataSource: [],
    getCurrentURL: () => {},
    ordering: 'surprise-me',
    onRowClick: () => {},
    push: () => {},
  };

  test('should work', () => {
    const wrapper = () => shallow(<DataList {...props} />);

    expect(wrapper).not.toThrow();
  });
});

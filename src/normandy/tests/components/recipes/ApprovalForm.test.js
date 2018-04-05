import { Map } from 'immutable';
import React from 'react';

import TestComponent from 'normandy/components/recipes/ApprovalForm';

const { WrappedComponent: ApprovalForm } = TestComponent;

describe('<ApprovalForm>', () => {
  const props = {
    approvalRequest: new Map(),
    closeApprovalRequest: () => {},
    form: {},
    onSubmit: () => {},
  };

  test('should work', () => {
    const wrapper = () => shallow(<ApprovalForm {...props} />);

    expect(wrapper).not.toThrow();
  });
});

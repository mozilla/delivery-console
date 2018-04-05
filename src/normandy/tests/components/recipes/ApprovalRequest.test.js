import { Map } from 'immutable';
import TestComponent from 'normandy/components/recipes/ApprovalRequest';

const { WrappedComponent: ApprovalRequest } = TestComponent;

describe('<ApprovalRequest>', () => {
  const props = {
    approvalRequest: new Map(),
    approveApprovalRequest: () => {},
    isPendingApproval: false,
    recipe: new Map(),
    rejectApprovalRequest: () => {},
    revision: new Map(),
  };

  it('should work', () => {
    const wrapper = () => shallow(<ApprovalRequest {...props} />);

    expect(wrapper).not.toThrow();
  });
});

import { Map } from 'immutable';
import TestComponent from 'console/workflows/recipes/components/ApprovalRequest';

const { WrappedComponent: ApprovalRequest } = TestComponent;

describe('<ApprovalRequest>', () => {
  const props = {
    approvalRequest: new Map(),
    approveApprovalRequest: () => {},
    currentRevision: new Map(),
    isPendingApproval: false,
    rejectApprovalRequest: () => {},
    revision: new Map(),
  };

  it('should work', () => {
    const wrapper = () => shallow(<ApprovalRequest {...props} />);

    expect(wrapper).not.toThrow();
  });
});

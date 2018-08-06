import TestComponent from 'console/workflows/recipes/components/RevisionNotice';

const { WrappedComponent: RevisionNotice } = TestComponent;

describe('<RevisionNotice>', () => {
  const props = {
    enabled: false,
    isPendingApproval: false,
    status: null,
  };

  it('should work', () => {
    const wrapper = () => shallow(<RevisionNotice {...props} />);

    expect(wrapper).not.toThrow();
  });
});

import TestComponent from 'normandy/components/recipes/RevisionNotice';

const { WrappedComponent: RevisionNotice } = TestComponent;

describe('<RevisionNotice>', () => {
  const props = {
    enabled: false,
    isPendingApproval: false,
    status: null,
  };

  test('should work', () => {
    const wrapper = () => shallow(<RevisionNotice {...props} />);

    expect(wrapper).not.toThrow();
  });
});

import TestComponent from 'console/workflows/extensions/pages/CreateExtensionPage';

const { WrappedComponent: CreateExtensionPage } = TestComponent;

describe('<CreateExtensionPage>', () => {
  const props = {
    createExtension: () => Promise.resolve(123),
    history: {},
    push: () => {},
  };

  it('should work', () => {
    const wrapper = () => shallow(<CreateExtensionPage {...props} />);

    expect(wrapper).not.toThrow();
  });
});

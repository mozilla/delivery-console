import TestComponent from 'normandy/components/extensions/ExtensionForm';

const { WrappedComponent: ExtensionForm } = TestComponent;

describe('<ExtensionForm>', () => {
  const props = {
    extension: new Map(),
    form: {},
    onSubmit: () => {},
  };

  it('should work', () => {
    const wrapper = () => shallow(<ExtensionForm {...props} />);

    expect(wrapper).not.toThrow();
  });
});

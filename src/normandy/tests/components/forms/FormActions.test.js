import FormActions from 'normandy/components/forms/FormActions';

describe('<FormActions>', () => {
  const props = {
    children: <div>Hello</div>,
  };

  test('should work', () => {
    const wrapper = () => shallow(<FormActions {...props} />);

    expect(wrapper).not.toThrow();
  });
});

describe('<FormActions.Primary>', () => {
  const props = {
    children: <div>Hello</div>,
  };

  test('should work', () => {
    const wrapper = () => shallow(<FormActions.Primary {...props} />);

    expect(wrapper).not.toThrow();
  });
});

describe('<FormActions.Secondary>', () => {
  const props = {
    children: <div>Hello</div>,
  };

  test('should work', () => {
    const wrapper = () => shallow(<FormActions.Secondary {...props} />);

    expect(wrapper).not.toThrow();
  });
});

import CheckboxMenu from 'normandy/components/common/CheckboxMenu';

describe('<CheckboxMenu>', () => {
  const props = {
    checkboxes: [],
    label: '',
    onChange: () => {},
    options: [],
  };

  it('should work', () => {
    const wrapper = () => shallow(<CheckboxMenu {...props} />);

    expect(wrapper).not.toThrow();
  });
});

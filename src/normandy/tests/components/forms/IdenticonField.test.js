import IdenticonField from 'normandy/components/forms/IdenticonField';

describe('<IdenticonField>', () => {
  const props = {
    disabled: false,
    onChange: () => {},
    value: 'test',
  };

  test('should work', () => {
    const wrapper = () => mount(<IdenticonField {...props} />);

    expect(wrapper).not.toThrow();
  });

  test('should use the v1 shield generation', () => {
    expect(IdenticonField.generateSeed().slice(0, 3)).toBe('v1:');
  });

  describe('selection buttons', () => {
    test('should generate a new item if at the end of the history', () => {
      let { value } = props;
      const wrapper = mount(
        <IdenticonField
          {...props}
          onChange={val => {
            value = val;
          }}
        />,
      );
      const next = wrapper.find('button.btn-next');

      next.simulate('click');

      expect(value).not.toBe(props.value);
    });

    test('should track a history of viewed icons', () => {
      let { value } = props;
      const wrapper = mount(
        <IdenticonField
          {...props}
          onChange={val => {
            value = val;
          }}
        />,
      );
      const next = wrapper.find('button.btn-next');

      expect(wrapper.state().history.size).toBe(1);
      expect(value).toBe(props.value);

      next.simulate('click');

      expect(wrapper.state().history.size).toBe(2);
      expect(value).not.toBe(props.value);
    });

    test('should go back in history if possible', () => {
      let { value } = props;
      const wrapper = mount(
        <IdenticonField
          {...props}
          onChange={val => {
            value = val;
          }}
        />,
      );
      let prev = wrapper.find('button.btn-prev');
      // Disabled at first until we move forward in history
      expect(prev.props().disabled).toBe(true);
      const originalValue = value;

      const next = wrapper.find('button.btn-next');
      next.simulate('click');

      prev = wrapper.find('button.btn-prev');
      expect(prev.props().disabled).toBe(false);

      prev.simulate('click');
      expect(value).toBe(originalValue);
    });

    test('should recall icons from history if moving forward', () => {
      let { value } = props;
      const wrapper = mount(
        <IdenticonField
          {...props}
          onChange={val => {
            value = val;
          }}
        />,
      );
      const prev = wrapper.find('button.btn-prev');
      const next = wrapper.find('button.btn-next');

      next.simulate('click');
      const originalValue = value;
      next.simulate('click');

      prev.simulate('click');
      expect(value).toBe(originalValue);
    });
  });
});

import IdenticonField from 'console/components/forms/IdenticonField';

const defaultProps = {
  disabled: false,
  value: 'test',
};

function createIndenticonFieldWrapper(props) {
  let wrapper;
  const fieldProps = {
    ...defaultProps,
    onChange: v => wrapper.setProps({ value: v }),
    ...props,
  };
  wrapper = mount(<IdenticonField {...fieldProps} />);
  return wrapper;
}

describe('<IdenticonField>', () => {
  it('should work', () => {
    expect(createIndenticonFieldWrapper).not.toThrow();
  });

  it('should use the v1 shield generation', () => {
    expect(IdenticonField.generateSeed().slice(0, 3)).toBe('v1:');
  });

  describe('selection buttons', () => {
    it('should generate a new item if at the end of the history', () => {
      const wrapper = createIndenticonFieldWrapper();
      const next = wrapper.find('button.btn-next');
      next.simulate('click');
      expect(wrapper.prop('value')).not.toBe(defaultProps.value);
    });

    it('should track a history of viewed icons', () => {
      const wrapper = createIndenticonFieldWrapper();
      const next = wrapper.find('button.btn-next');

      expect(wrapper.state().history.size).toBe(1);
      expect(wrapper.prop('value')).toBe(defaultProps.value);

      next.simulate('click');

      expect(wrapper.state().history.size).toBe(2);
      expect(wrapper.prop('value')).not.toBe(defaultProps.value);
    });

    it('should go back in history if possible', () => {
      const wrapper = createIndenticonFieldWrapper();

      let prev = wrapper.find('button.btn-prev');
      // Disabled at first until we move forward in history
      expect(prev.prop('disabled')).toBe(true);

      const next = wrapper.find('button.btn-next');
      next.simulate('click');

      prev = wrapper.find('button.btn-prev');
      expect(prev.prop('disabled')).toBe(false);

      prev.simulate('click');
      expect(wrapper.prop('value')).toBe(defaultProps.value);
    });

    it('should recall icons from history if moving forward', () => {
      const wrapper = createIndenticonFieldWrapper();
      const prev = wrapper.find('button.btn-prev');
      const next = wrapper.find('button.btn-next');

      next.simulate('click');
      const originalValue = wrapper.prop('value');
      next.simulate('click');

      prev.simulate('click');
      expect(wrapper.prop('value')).toBe(originalValue);
    });
  });
});

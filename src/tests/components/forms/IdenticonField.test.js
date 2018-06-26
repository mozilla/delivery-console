import IdenticonField from 'console/components/forms/IdenticonField';

describe('<IdenticonField>', () => {
  const props = {
    disabled: false,
    value: 'test',
  };

  it('should work', () => {
    const wrapper = () => mount(<IdenticonField {...props} />);

    expect(wrapper).not.toThrow();
  });

  it('should use the v1 shield generation', () => {
    expect(IdenticonField.generateSeed().slice(0, 3)).toBe('v1:');
  });

  describe('selection buttons', () => {
    it('should generate a new item if at the end of the history', () => {
      const wrapper = mount(<IdenticonField {...props} />);
      const { history, index } = wrapper.state();
      const next = wrapper.find('button.btn-next');

      next.simulate('click');
      const { history: updatedHistory, index: updatedIndex } = wrapper.state();

      expect(index).not.toBe(updatedIndex);
      expect(history.get(index)).not.toBe(updatedHistory.get(updatedIndex));
    });

    it('should track a history of viewed icons', () => {
      const wrapper = mount(<IdenticonField {...props} />);
      let { history, index } = wrapper.state();
      const next = wrapper.find('button.btn-next');

      expect(wrapper.state().history.size).toBe(1);
      expect(history.get(index)).toBe(props.value);

      next.simulate('click');
      ({ history, index } = wrapper.state());

      expect(wrapper.state().history.size).toBe(2);
      expect(history.get(index)).not.toBe(props.value);
    });

    it('should go back in history if possible', () => {
      const wrapper = mount(<IdenticonField {...props} />);
      let { history, index } = wrapper.state();
      let prev = wrapper.find('button.btn-prev');
      // Disabled at first until we move forward in history
      expect(prev.props().disabled).toBe(true);
      const originalValue = history.get(index);

      const next = wrapper.find('button.btn-next');
      next.simulate('click');

      prev = wrapper.find('button.btn-prev');
      expect(prev.props().disabled).toBe(false);

      prev.simulate('click');
      ({ history, index } = wrapper.state());
      expect(history.get(index)).toBe(originalValue);
    });

    it('should recall icons from history if moving forward', () => {
      const wrapper = mount(<IdenticonField {...props} />);
      const prev = wrapper.find('button.btn-prev');
      const next = wrapper.find('button.btn-next');

      next.simulate('click');
      let { history, index } = wrapper.state();
      const originalValue = history.get(index);
      next.simulate('click');
      ({ history, index } = wrapper.state());
      expect(history.get(index)).not.toBe(originalValue);

      prev.simulate('click');
      ({ history, index } = wrapper.state());
      expect(history.get(index)).toBe(originalValue);
    });
  });
});

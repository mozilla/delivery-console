import BooleanIcon from 'normandy/components/common/BooleanIcon';

describe('<BooleanIcon>', () => {
  it('should work when true', () => {
    const wrapper = () => shallow(<BooleanIcon value />);

    expect(wrapper).not.toThrow();
  });

  it('should work when false', () => {
    const wrapper = () => shallow(<BooleanIcon value={false} />);

    expect(wrapper).not.toThrow();
  });
});

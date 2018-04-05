import Gateway from 'normandy/components/pages/Gateway';

describe('<Gateway>', () => {
  it('should work', () => {
    const wrapper = () => shallow(<Gateway />);

    expect(wrapper).not.toThrow();
  });
});

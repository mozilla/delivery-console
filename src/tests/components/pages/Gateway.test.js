import Gateway from 'console/components/pages/Gateway';

describe('<Gateway>', () => {
  it('should work', () => {
    const wrapper = () => shallow(<Gateway />);

    expect(wrapper).not.toThrow();
  });
});

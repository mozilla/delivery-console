import MissingPage from 'console/components/pages/MissingPage';

describe('<MissingPage>', () => {
  it('should work', () => {
    const wrapper = () => shallow(<MissingPage />);

    expect(wrapper).not.toThrow();
  });
});

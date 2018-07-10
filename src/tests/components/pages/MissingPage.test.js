import TestComponent from 'console/components/pages/MissingPage';

const { WrappedComponent: MissingPage } = TestComponent;

describe('<MissingPage>', () => {
  it('should work', () => {
    const wrapper = () => shallow(<MissingPage pathname="/oops/" />);
    expect(wrapper).not.toThrow();
  });
});

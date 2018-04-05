import App from './App';

describe('delivery-console', () => {
  it('renders without crashing', () => {
    const wrapper = () => shallow(<App />);
    expect(wrapper).not.toThrow();
  });
});

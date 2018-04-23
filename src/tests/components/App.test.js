import App from 'console/components/App';
import { wrapMockStore } from 'console/tests/mockStore';

describe('delivery-console', () => {
  it('renders without crashing', () => {
    const wrapper = () => shallow(wrapMockStore(<App />));
    expect(wrapper).not.toThrow();
  });
});

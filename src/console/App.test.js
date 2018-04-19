import App from './App';
import { wrapMockStore } from 'normandy/tests/mockStore';

describe('delivery-console', () => {
  it('renders without crashing', () => {
    const wrapper = () => shallow(wrapMockStore(<App />));
    expect(wrapper).not.toThrow();
  });
});

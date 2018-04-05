import React from 'react';
import App from './App';
import { shallow } from 'enzyme';

describe('normandy', () => {
  beforeAll(() => {
    const fakeStorage = {
      store: {},
      getItem: key => fakeStorage.store[key] || null,
      setItem: (key, value) => (fakeStorage.store[key] = value),
    };
    Object.defineProperty(window, 'localStorage', {
      value: fakeStorage,
    });
  });

  it('renders without crashing', () => {
    const wrapper = () => shallow(<App />);
    expect(wrapper).not.toThrow();
  });
});

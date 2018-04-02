import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';
import { shallow } from 'enzyme';

describe('delivery-console', () => {
  it('renders without crashing', () => {
    const wrapper = () => shallow(<App />);
    expect(wrapper).not.toThrow();
  });
});

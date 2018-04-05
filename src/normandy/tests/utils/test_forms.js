import React from 'react';
import { mount } from 'enzyme';

import { createForm, connectFormProps } from 'normandy/utils/forms';

class FakeComponent extends React.PureComponent {
  render() {
    return null;
  }
}

describe('Forms utils', () => {
  describe('createForm', () => {
    test('should exist', () => {
      expect(!!createForm).toBe(true);
    });

    test('should return the nested React element', () => {
      const FakeForm = createForm({})(FakeComponent);
      const form = mount(<FakeForm />);
      expect(form.find(FakeComponent).length).toBe(1);
    });
  });

  describe('connectFormProps', () => {
    test('should exist', () => {
      expect(!!connectFormProps).toBe(true);
    });

    test('should return the nested React component', () => {
      const ConnectedComponent = connectFormProps(FakeComponent);
      const comp = mount(<ConnectedComponent />);
      expect(comp.find(FakeComponent).length).toBe(1);
    });

    test('should add `form` and `formErrors` props to the nested component', () => {
      const ConnectedComponent = connectFormProps(FakeComponent);
      const comp = mount(<ConnectedComponent />);
      const props = Object.keys(comp.find(FakeComponent).props());
      expect(props).toEqual(['form', 'formErrors']);
    });
  });
});

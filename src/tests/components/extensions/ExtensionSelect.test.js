import { List } from 'immutable';
import { wrapMockStore } from 'console/tests/mockStore';
import TestComponent from 'console/components/extensions/ExtensionSelect';

const { WrappedComponent: ExtensionSelect } = TestComponent;

describe('<ExtensionSelect>', () => {
  const props = {
    disabled: false,
    extensions: new List(),
    isLoadingSearch: false,
    onChange: () => {},
    size: 'small',
  };

  it('should work', () => {
    // Need to wrap the components with a mock store in order to mount the nested
    // (but connected) query component.
    const wrapper = () => mount(wrapMockStore(<ExtensionSelect {...props} />));

    expect(wrapper).not.toThrow();
  });

  it('should display the placeholder element appropriately', () => {
    const wrapper = mount(wrapMockStore(<ExtensionSelect {...props} />));

    // Determine if the ant placeholder is present on the page.
    const placeholderElement = wrapper.find(
      'div.ant-select-selection__placeholder',
    );
    expect(placeholderElement.length).toBe(1);

    // Determine if the placeholder is actually visible to the user.
    const placeholderStyle = placeholderElement.prop('style');
    expect(placeholderStyle.display).toBe('block');
  });
});

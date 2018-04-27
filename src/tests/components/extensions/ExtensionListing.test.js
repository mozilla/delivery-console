import { List } from 'immutable';
import TestComponent from 'console/components/extensions/ExtensionListing';

const { WrappedComponent: ExtensionListing } = TestComponent;

describe('<ExtensionListing>', () => {
  const props = {
    columns: new List(),
    count: 10,
    extensions: new List(),
    getCurrentURL: () => {},
    history: {},
    ordering: null,
    pageNumber: 1,
    push: () => {},
  };

  it('should work', () => {
    const wrapper = () => shallow(<ExtensionListing {...props} />);

    expect(wrapper).not.toThrow();
  });
});

import { List } from 'immutable';
import TestComponent from 'console/workflows/extensions/pages/ExtensionListingPage';

const { WrappedComponent: ExtensionListingPage } = TestComponent;

describe('<ExtensionListingPage>', () => {
  const props = {
    columns: new List(),
    count: 10,
    extensions: new List(),
    getCurrentUrlAsObject: () => {},
    history: {},
    ordering: null,
    pageNumber: 1,
    push: () => {},
  };

  it('should work', () => {
    const wrapper = () => shallow(<ExtensionListingPage {...props} />);

    expect(wrapper).not.toThrow();
  });
});

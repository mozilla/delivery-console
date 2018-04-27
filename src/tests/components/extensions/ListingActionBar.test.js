import { List } from 'immutable';
import TestComponent from 'console/components/extensions/ListingActionBar';

const { WrappedComponent: ListingActionBar } = TestComponent;

describe('<ListingActionBar>', () => {
  const props = {
    columns: new List(),
    getCurrentURL: () => {},
    history: {},
    push: () => {},
    saveExtensionListingColumns: () => {},
  };

  it('should work', () => {
    const wrapper = () => shallow(<ListingActionBar {...props} />);

    expect(wrapper).not.toThrow();
  });
});

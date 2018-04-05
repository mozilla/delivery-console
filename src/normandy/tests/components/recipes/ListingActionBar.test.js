import { List } from 'immutable';
import TestComponent from 'normandy/components/recipes/ListingActionBar';

const { WrappedComponent: ListingActionBar } = TestComponent;

describe('<ListingActionBar>', () => {
  const props = {
    columns: new List(),
    getCurrentURL: () => {},
    push: () => {},
    saveExtensionListingColumns: () => {},
  };

  it('should work', () => {
    const wrapper = () => shallow(<ListingActionBar {...props} />);

    expect(wrapper).not.toThrow();
  });
});

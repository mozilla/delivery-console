import { Map } from 'immutable';
import TestComponent from 'normandy/components/recipes/DetailsActionBar';

const { WrappedComponent: DetailsActionBar } = TestComponent;

describe('<DetailsActionBar>', () => {
  const props = {
    disableRecipe: () => {},
    enableRecipe: () => {},
    isApprovable: false,
    isLatest: false,
    isLatestApproved: false,
    isPendingApproval: false,
    recipe: new Map(),
    recipeId: 123,
    requestRevisionApproval: () => {},
    revisionId: 'abc',
    routerPath: '/path/to/page',
  };

  test('should work', () => {
    const wrapper = () => shallow(<DetailsActionBar {...props} />);

    expect(wrapper).not.toThrow();
  });
});

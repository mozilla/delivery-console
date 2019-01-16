import { Map } from 'immutable';
import TestComponent from 'console/workflows/recipes/components/DetailsActionBar';

const { WrappedComponent: DetailsActionBar } = TestComponent;

describe('<DetailsActionBar>', () => {
  const props = {
    currentRevision: new Map(),
    disableRecipe: () => {},
    enableRecipe: () => {},
    isApprovable: false,
    isLatest: false,
    isLatestApproved: false,
    isPendingApproval: false,
    recipeId: 123,
    requestRevisionApproval: () => {},
    revisionId: 123,
    routerPath: '/path/to/page',
  };

  it('should work', () => {
    const wrapper = () => shallow(<DetailsActionBar {...props} />);

    expect(wrapper).not.toThrow();
  });
});

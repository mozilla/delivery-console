import { List } from 'immutable';
import TestComponent from 'console/components/recipes/ApprovalHistoryPage';

const { WrappedComponent: ApprovalHistoryPage } = TestComponent;

describe('<ApprovalHistoryPage>', () => {
  const props = {
    history: new List(),
    recipeId: 123,
  };

  it('should work', () => {
    const wrapper = () => shallow(<ApprovalHistoryPage {...props} />);

    expect(wrapper).not.toThrow();
  });
});

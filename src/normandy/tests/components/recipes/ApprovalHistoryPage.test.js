import { List } from 'immutable';
import TestComponent from 'normandy/components/recipes/ApprovalHistoryPage';

const { WrappedComponent: ApprovalHistoryPage } = TestComponent;

describe('<ApprovalHistoryPage>', () => {
  const props = {
    history: new List(),
    recipeId: 123,
  };

  test('should work', () => {
    const wrapper = () => shallow(<ApprovalHistoryPage {...props} />);

    expect(wrapper).not.toThrow();
  });
});

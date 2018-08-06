import { List } from 'immutable';
import TestComponent from 'console/workflows/recipes/components/HistoryTimeline';

const { WrappedComponent: HistoryTimeline } = TestComponent;

describe('<HistoryTimeline>', () => {
  const props = {
    history: new List(),
    isLatestRevision: () => {},
    recipeId: 123,
    selectedRevisionId: 123,
  };

  it('should work', () => {
    const wrapper = () => shallow(<HistoryTimeline {...props} />);

    expect(wrapper).not.toThrow();
  });
});

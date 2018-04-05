import { List } from 'immutable';
import TestComponent from 'normandy/components/recipes/HistoryTimeline';

const { WrappedComponent: HistoryTimeline } = TestComponent;

describe('<HistoryTimeline>', () => {
  const props = {
    history: new List(),
    isLatestRevision: () => {},
    recipeId: 123,
    selectedRevisionId: 'abc',
  };

  test('should work', () => {
    const wrapper = () => shallow(<HistoryTimeline {...props} />);

    expect(wrapper).not.toThrow();
  });
});

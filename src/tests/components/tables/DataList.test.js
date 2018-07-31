import { List } from 'immutable';
import TestComponent from 'console/components/tables/DataList';

const { WrappedComponent: DataList } = TestComponent;

describe('<DataList>', () => {
  const props = {
    columnRenderers: {},
    columns: new List(),
    dataSource: [],
    getCurrentUrlAsObject: () => {},
    getUrlFromRecord: () => {},
    history: {},
    openNewWindow: () => {},
    ordering: 'surprise-me',
    onRowClick: () => {},
    push: () => {},
  };

  it('should work', () => {
    const wrapper = () => shallow(<DataList {...props} />);

    expect(wrapper).not.toThrow();
  });
});

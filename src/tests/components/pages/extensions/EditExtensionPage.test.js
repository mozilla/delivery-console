import QueryExtension from 'console/components/data/QueryExtension';
import TestComponent from 'console/workflows/extensions/pages/EditExtensionPage';
import { Map } from 'immutable';

const { WrappedComponent: EditExtensionPage } = TestComponent;

describe('<EditExtensionPage>', () => {
  const props = {
    extension: new Map(),
    extensionId: 123,
    updateExtension: () => Promise.resolve(),
  };

  it('should work', () => {
    const wrapper = () => shallow(<EditExtensionPage {...props} />);

    expect(wrapper).not.toThrow();
  });

  it('should have a QueryExtension component', () => {
    const wrapper = shallow(<EditExtensionPage {...props} />);
    expect(wrapper.find(QueryExtension).length).toBe(1);
  });
});

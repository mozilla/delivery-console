import TestComponent from 'console/components/data/QueryExtensionListingColumns';
import { StubComponent } from 'console/tests/utils';

const { WrappedComponent: QueryExtensionListingColumns } = TestComponent;

describe('<QueryExtensionListingColumns>', () => {
  const props = {
    loadExtensionListingColumns: () => {},
  };

  it('should work', () => {
    const wrapper = () => shallow(<QueryExtensionListingColumns {...props} />);

    expect(wrapper).not.toThrow();
  });

  it('should call loadExtensionListingColumns on mount', () => {
    let called = false;
    shallow(
      <QueryExtensionListingColumns
        loadExtensionListingColumns={() => {
          called = true;
        }}
      />,
    );

    expect(called).toBe(true);
  });

  it('should call loadExtensionListingColumns once if container props change', () => {
    let callCount = 0;
    const wrapper = mount(
      <StubComponent fakeProp={1}>
        <QueryExtensionListingColumns
          loadExtensionListingColumns={() => {
            callCount += 1;
          }}
        />
      </StubComponent>,
    );

    wrapper.setProps({ fakeProp: 2 });
    wrapper.setProps({ fakeProp: 3 });
    wrapper.setProps({ fakeProp: 4 });

    expect(callCount).toBe(1);
  });

  it('should not render anything', () => {
    const wrapper = shallow(<QueryExtensionListingColumns {...props} />);
    expect(wrapper.children().length).toBe(0);
  });
});

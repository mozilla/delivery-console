import TestComponent from 'console/components/data/QueryServiceInfo';
import { StubComponent } from 'console/tests/utils';

const { WrappedComponent: QueryServiceInfo } = TestComponent;

describe('<QueryServiceInfo>', () => {
  const props = {
    fetchServiceInfo: () => {},
  };

  it('should work', () => {
    const wrapper = () => shallow(<QueryServiceInfo {...props} />);

    expect(wrapper).not.toThrow();
  });

  it('should call fetchServiceInfo on mount', () => {
    let called = false;
    shallow(
      <QueryServiceInfo
        fetchServiceInfo={() => {
          called = true;
        }}
      />,
    );

    expect(called).toBe(true);
  });

  it('should call fetchServiceInfo once if container props change', () => {
    let callCount = 0;
    const wrapper = mount(
      <StubComponent fakeProp={1}>
        <QueryServiceInfo
          fetchServiceInfo={() => {
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
    const wrapper = shallow(<QueryServiceInfo {...props} />);
    expect(wrapper.children().length).toBe(0);
  });
});

import TestComponent from 'normandy/components/data/QueryRecipeHistory';

const { WrappedComponent: QueryRecipeHistory } = TestComponent;

describe('<QueryRecipeHistory>', () => {
  const props = {
    fetchRecipeHistory: () => {},
    pk: 1,
  };

  test('should work', () => {
    const wrapper = () => shallow(<QueryRecipeHistory {...props} />);

    expect(wrapper).not.toThrow();
  });

  test('should call fetchRecipeHistory on mount', () => {
    let called = false;
    mount(
      <QueryRecipeHistory
        {...props}
        fetchRecipeHistory={() => {
          called = true;
        }}
      />,
    );

    expect(called).toBe(true);
  });

  test('should call fetchRecipeHistory if the `pk` changes', () => {
    let callCount = 0;
    const wrapper = shallow(
      <QueryRecipeHistory
        {...props}
        fetchRecipeHistory={() => {
          callCount += 1;
        }}
      />,
    );
    expect(callCount).toBe(1);

    wrapper.setProps({ pk: 2 });
    expect(callCount).toBe(2);

    wrapper.setProps({ irrelevant: true });
    expect(callCount).toBe(2);

    wrapper.setProps({ pk: 2 });
    expect(callCount).toBe(2);

    wrapper.setProps({ pk: 3 });
    expect(callCount).toBe(3);
  });

  test('should call fetchRecipeHistory once if container props change', () => {
    let callCount = 0;
    const wrapper = mount(
      <Stub fakeProp={1}>
        <QueryRecipeHistory
          {...props}
          fetchRecipeHistory={() => {
            callCount += 1;
          }}
        />
      </Stub>,
    );
    expect(callCount).toBe(1);

    wrapper.setProps({ fakeProp: 2 });
    wrapper.setProps({ fakeProp: 3 });
    wrapper.setProps({ fakeProp: 4 });

    expect(callCount).toBe(1);
  });

  test('should not render anything', () => {
    const wrapper = shallow(<QueryRecipeHistory {...props} />);
    expect(wrapper.children().length).toBe(0);
  });
});

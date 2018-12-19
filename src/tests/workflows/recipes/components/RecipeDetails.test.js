import Immutable, { Map } from 'immutable';
import RecipeDetails, { ArgumentsValue } from 'console/workflows/recipes/components/RecipeDetails';

describe('<RecipeDetails>', () => {
  const props = {
    revision: new Map(),
  };

  it('should work', () => {
    const wrapper = () => shallow(<RecipeDetails {...props} />);
    expect(wrapper).not.toThrow();
  });
});

describe('<ArgumentsValue>', () => {
  it('should render strings directly', () => {
    const wrapper = shallow(<ArgumentsValue value="Hello, world!" />);
    expect(wrapper.find('.value').text()).toBe('Hello, world!');
  });

  it('should render numbers directly', () => {
    const wrapper = shallow(<ArgumentsValue value={42} />);
    expect(wrapper.find('.value').text()).toBe('42');
  });

  it('should render booleans as True and False', () => {
    let wrapper = shallow(<ArgumentsValue value />);
    expect(wrapper.find('.value').text()).toBe('True');
    wrapper = shallow(<ArgumentsValue value={false} />);
    expect(wrapper.find('.value').text()).toBe('False');
  });

  it('should render extra_filter_expression as code', () => {
    const wrapper = shallow(<ArgumentsValue name="extra_filter_expression" value="code" />);
    expect(wrapper.find('.value').html()).toBe(
      '<div class="value"><pre><code>code</code></pre></div>',
    );
  });

  it('should render branches as a table', () => {
    const value = Immutable.fromJS([
      { slug: 'one', value: 1, ratio: 1 },
      { slug: 'two', value: 2, ratio: 3 },
    ]);
    const wrapper = shallow(<ArgumentsValue name="branches" value={value} />);
    const children = wrapper.find('.value').children();
    expect(children.length).toBe(1);
    expect(children.type()).toBe('table');
    const content = children.html();

    expect(content).toContain('one');
    expect(content).toContain('1');
    expect(content).toContain('25%');

    expect(content).toContain('two');
    expect(content).toContain('2');
    expect(content).toContain('75%');
  });

  it('should render preferences as a table', () => {
    const value = Immutable.fromJS([
      { preferenceName: 'name', value: 'Peter' },
      { preferenceName: 'kids', value: 2 },
      { preferenceName: 'wrong', value: false },
    ]);
    const wrapper = shallow(
      <ArgumentsValue name="preferences" actionName="preference-rollout" value={value} />,
    );
    const children = wrapper.find('.value').children();
    expect(children.length).toBe(1);
    expect(children.type()).toBe('table');
    const content = children.html();
    expect(content).toContain('<code>Peter</code>');
    expect(content).toContain('<code>2</code>');
    expect(content).toContain('<code>false</code>');
  });

  describe('immutable objects', () => {
    it('should convert Immutable objects into JSON strings', () => {
      const testData = { slug: 'one', value: { test: 'fake-value' }, ratio: 1 };
      // Test against Maps
      let value = Immutable.fromJS(testData);
      expect(ArgumentsValue.stringifyImmutable(value)).toBe(JSON.stringify(testData, null, 2));

      // Test against Lists
      value = Immutable.fromJS([testData]);
      expect(ArgumentsValue.stringifyImmutable(value)).toBe(JSON.stringify([testData], null, 2));
    });

    it('should use a JSON string for copy/pasting Immutable fields', () => {
      const argumentVal = new Map({ slug: 'one', value: false, ratio: 1 });
      const expectedText = ArgumentsValue.stringifyImmutable(argumentVal);

      const wrapper = shallow(<ArgumentsValue value={argumentVal} />);
      const copyPasteButton = wrapper.find('.copy-icon');
      expect(copyPasteButton.props().text).toBe(expectedText);
    });
  });
});

import { Map, List, fromJS } from 'immutable';
import { render, fireEvent } from 'react-testing-library';
import fetchMock from 'fetch-mock';
import { NORMANDY_ADMIN_API_ROOT_URL } from 'console/settings';
import FilterObjectForm, {
  serializeFilterObjectToMap,
  deserializeFilterObjectToList,
  InputsWidget,
  rewriteSamplingInput,
  SamplingInput,
  VersionsInput,
  parseIntOrNull,
} from 'console/workflows/recipes/components/FilterObjectForm';
import { createForm } from 'console/utils/forms';
import { wrapMockStore } from 'console/tests/mockStore';

describe('<FilterObjectForm>', () => {
  it('should render the form with an empty existing filter object', () => {
    fetchMock.getOnce(`${NORMANDY_ADMIN_API_ROOT_URL}v3/filters/`, {
      channels: [
        {
          key: 'beta',
          value: 'Beta',
        },
      ],
      countries: [{ key: 'SE', value: 'Sweden' }],
      locales: [{ key: 'sv', value: 'Swedish' }],
    });

    const filterObject = serializeFilterObjectToMap(fromJS([]));
    const props = {
      disabled: false,
      form: {
        getFieldValue: key => {
          // Remember, 'key' is something like "filter_object.locales"
          const value = filterObject.get(key.split('.')[1]);
          if (value) {
            return value.toJS();
          }
        },
        getFieldDecorator: (key, config) => {
          return Component => {
            return;
          };
        },
      },
      filterObject,
      filterObjectErrors: {},
      onSubmit: jest.fn(),
    };

    const FakeForm = createForm({})(FilterObjectForm);
    const { getByText } = render(wrapMockStore(<FakeForm {...props} />));
    expect(getByText('Geo (0)')).toBeTruthy();
    expect(getByText('Browser (0)')).toBeTruthy();
    expect(getByText('Sampling (0)')).toBeTruthy();
    expect(fetchMock.called()).toBeTruthy();
  });

  it('should render the form with a full existing filter object', () => {
    fetchMock.getOnce(`${NORMANDY_ADMIN_API_ROOT_URL}v3/filters/`, {
      channels: [
        {
          key: 'beta',
          value: 'Beta',
        },
      ],
      countries: [{ key: 'SE', value: 'Sweden' }],
      locales: [{ key: 'sv', value: 'Swedish' }],
    });

    const filterObject = serializeFilterObjectToMap(
      fromJS([
        { type: 'channel', channels: ['beta'] },
        { type: 'country', countries: ['SE'] },
        { type: 'locale', locales: ['sv'] },
        { type: 'channel', channels: ['beta'] },
        { type: 'version', versions: [67, 68, 69] },
        { type: 'bucketSample', start: 10, count: 20, total: 30, input: [] },
      ]),
    );
    const props = {
      disabled: false,
      form: {
        getFieldValue: key => {
          // Remember, 'key' is something like "filter_object.locales"
          const value = filterObject.get(key.split('.')[1]);
          if (value) {
            return value.toJS();
          }
        },
        getFieldDecorator: (key, config) => {
          return Component => {
            return;
          };
        },
      },
      allChannels: fromJS([{ value: 'Release', key: 'release' }]),
      allCountries: fromJS([{ value: 'Sweden', key: 'SE' }]),
      allLocales: fromJS([{ value: 'Swedish', key: 'sv' }]),
      filterObject,
      onSubmit: jest.fn(),
    };

    const FakeForm = createForm({})(FilterObjectForm);
    const { getByText } = render(wrapMockStore(<FakeForm {...props} />));

    // Expect to see "Geo (2)" because a country and a locale is chosen.
    expect(getByText('Geo (2)')).toBeTruthy();
    // Same with "Browser (2)" because both channels and versions is chosen.
    expect(getByText('Browser (2)')).toBeTruthy();
    // And "Sampling (1)" because a sampling method has been chosen.
    expect(getByText('Sampling (1)')).toBeTruthy();

    expect(fetchMock.called()).toBeTruthy();
  });

  describe('serializeFilterObjectToMap function', () => {
    it('should serialize an empty List to an empty Map', () => {
      const map = serializeFilterObjectToMap(List());
      expect(map).toEqualImmutable(Map());
    });

    it('should serialize an non-empty List to a Map', () => {
      const list = fromJS([
        { type: 'channel', channels: ['beta'] },
        {
          type: 'bucketSample',
          start: 50,
          count: 70,
          total: 100,
          input: ['normandy.request_time'],
        },
      ]);
      const map = serializeFilterObjectToMap(list);
      expect(map).toBeImmutableMap();
      expect(map.size).toEqual(2);
      expect(map.get('channels')).toEqual(List(['beta']));
      expect(map.get('_sampling')).toEqual(
        fromJS({
          type: 'bucketSample',
          start: 50,
          count: 70,
          total: 100,
          input: ['normandy.request_time'],
        }),
      );
    });

    it('should serialize an undefined List to an empty Map', () => {
      const map = serializeFilterObjectToMap(undefined);
      expect(map).toBeImmutableMap();
      expect(map.size).toEqual(0);
    });

    it('should throw error on something truthy that is not a List', () => {
      expect(() => {
        serializeFilterObjectToMap([]);
      }).toThrow("'' (object) is not a List");
    });

    it('should throw error on an unrecognized key', () => {
      const list = fromJS([{ type: 'color', colors: ['red'] }]);
      expect(() => {
        serializeFilterObjectToMap(list);
      }).toThrow("Not sure how to convert 'color'");
    });
  });

  describe('deserializeFilterObjectToList function', () => {
    it('should deserialize an undefined Map to an empty List', () => {
      const map = deserializeFilterObjectToList(undefined);
      expect(map).toBeImmutableList();
      expect(map.size).toEqual(0);
    });

    it('should serialize an non-empty Map to a List', () => {
      const obj = {
        channels: ['beta'],
      };
      const list = deserializeFilterObjectToList(obj);
      expect(list).toBeImmutableList();
      expect(list.size).toEqual(1);
      expect(list.first()).toEqual(fromJS({ type: 'channel', channels: ['beta'] }));
    });

    it('should throw an error on unrecognized names', () => {
      const obj = {
        colors: ['red'],
      };
      expect(() => {
        deserializeFilterObjectToList(obj);
      }).toThrow("Key 'colors' no in known mapping.");
    });

    it('should serialize a map with the exceptional _sampling', () => {
      const obj = {
        _sampling: {
          type: 'bucketSample',
          start: 50,
          count: 70,
          total: 100,
          input: ['normandy.request_time'],
        },
      };
      const list = deserializeFilterObjectToList(obj);
      expect(list).toBeImmutableList();
      expect(list.size).toEqual(1);
      expect(list.first()).toEqual(
        fromJS({
          type: 'bucketSample',
          start: 50,
          count: 70,
          total: 100,
          input: ['normandy.request_time'],
        }),
      );
    });
  });

  describe('utility functions', () => {
    it('should should parse inputs to either integer or null', () => {
      expect(parseIntOrNull(1)).toEqual(1);
      expect(parseIntOrNull('2')).toEqual(2);
      expect(parseIntOrNull('2.0')).toBeNull();
      expect(parseIntOrNull(Infinity)).toBeNull();
      expect(parseIntOrNull('junk')).toBeNull();
      expect(parseIntOrNull(1.1)).toBeNull();
      expect(parseIntOrNull([])).toBeNull();
    });

    it('should rewrite sampling input strings in a smart way', () => {
      const options = ['normandy.request_time', 'normandy.clientId'];
      expect(rewriteSamplingInput('normandy.request_time', options)).toEqual(
        'normandy.request_time',
      );
      expect(rewriteSamplingInput('string', options)).toEqual('"string"');
      expect(rewriteSamplingInput('123', options)).toEqual(123);
    });
  });

  describe('<InputsWidget>', () => {
    it('should be possible to add more inputs', () => {
      const props = {
        disabled: false,
        bubbleUp: jest.fn(),
        value: {
          input: ['normandy.request_time'],
        },
        onSubmit: jest.fn(),
      };

      // Create a Form wrapper to get the child contexts automatically passed.
      const FakeForm = createForm({})(InputsWidget);
      const { container } = render(<FakeForm {...props} />);
      // Have to use querySelector because there's no text on the button.
      const button = container.querySelector('button[type="button"]');
      expect(button.disabled).toBeTruthy();
      fireEvent.click(button);
      // Because it's disabled. Because nothing has been typed in.
      expect(props.bubbleUp).toHaveBeenCalledTimes(0);
      const input = container.querySelector('input');
      // Can't use `fireEvent.change(input)` because it's a controlled component.
      fireEvent.change(input, {
        target: { value: '   ' },
      });
      // Input is just whitespace, so the button is still disabled.
      expect(button.disabled).toBeTruthy();
      fireEvent.change(input, {
        target: { value: ' freetext ' },
      });
      expect(button.disabled).toBeFalsy();
      fireEvent.click(button);
      expect(props.bubbleUp).toHaveBeenCalledTimes(1);
      expect(props.bubbleUp).toBeCalledWith({ input: ['"freetext"', 'normandy.request_time'] });

      // Type something else in.
      expect(input.value).toEqual(''); // should have been wiped
      fireEvent.change(input, {
        target: { value: '123' },
      });
      expect(button.disabled).toBeFalsy();
      fireEvent.click(button);
      expect(props.bubbleUp).toHaveBeenCalledTimes(2);
      expect(props.bubbleUp).toBeCalledWith({
        input: ['"freetext"', 123, 'normandy.request_time'],
      });

      expect(input.value).toEqual(''); // should have been wiped
      fireEvent.change(input, {
        target: { value: 'normandy.clientId' },
      });
      expect(button.disabled).toBeFalsy();
      fireEvent.click(button);
      expect(props.bubbleUp).toHaveBeenCalledTimes(3);
      expect(props.bubbleUp).toBeCalledWith({
        input: ['"freetext"', 123, 'normandy.clientId', 'normandy.request_time'],
      });
    });

    it('should not be possible to add inputs that already are set', () => {
      const props = {
        disabled: false,
        bubbleUp: jest.fn(),
        value: {
          input: ['normandy.request_time', '"foobar"', 456],
        },
        onSubmit: jest.fn(),
      };

      // Create a Form wrapper to get the child contexts automatically passed.
      const FakeForm = createForm({})(InputsWidget);
      const { container } = render(<FakeForm {...props} />);
      // Have to use querySelector because there's no text on the button.
      const button = container.querySelector('button[type="button"]');
      expect(button.disabled).toBeTruthy();

      const input = container.querySelector('input');
      // Can't use `fireEvent.change(input)` because it's a controlled component.
      fireEvent.change(input, {
        target: { value: 'normandy.request_time' },
      });
      // Current input isn't new!
      expect(button.disabled).toBeTruthy();
      // Even if you enter something that would be eventually reformatted it shouldn't allow it.
      fireEvent.change(input, {
        target: { value: 'foobar' },
      });
      // Current input still isn't new!
      expect(button.disabled).toBeTruthy();
      // As an string-to-int it should notice that that integer is already entered.
      fireEvent.change(input, {
        target: { value: '456' },
      });
      // Current input still isn't new!
      expect(button.disabled).toBeTruthy();
    });

    it('should suggest good matches in autocomplete suggestions', () => {
      const props = {
        disabled: false,
        bubbleUp: jest.fn(),
        value: {},
        defaultInputOptions: ['normandy.foo', 'normandy.man'],
        onSubmit: jest.fn(), // otherwise set by createForm()
      };
      const FakeForm = createForm({})(InputsWidget);
      const { container, queryByText, getByText } = render(<FakeForm {...props} />);
      const input = container.querySelector('input');
      // Can't use `fireEvent.change(input)` because it's a controlled component.
      fireEvent.change(input, {
        target: { value: 'm' },
      });
      expect(getByText('normandy.man')).not.toBeNull();
      // If should have filtered out 'normandy.foo' even though it naively contains
      // the string 'm'.
      expect(queryByText('normandy.foo')).toBeNull();
    });

    it('should be possible to remove an existing input', () => {
      const props = {
        disabled: false,
        bubbleUp: jest.fn(),
        value: {
          input: ['normandy.clientId', 'normandy.request_time'],
        },
        defaultInputOptions: ['normandy.foo', 'normandy.man'],
        onSubmit: jest.fn(), // otherwise set by createForm()
      };
      const FakeForm = createForm({})(InputsWidget);
      const { getByText } = render(<FakeForm {...props} />);
      const tag = getByText('normandy.clientId');
      const closeIcon = tag.querySelector('.anticon-close');
      fireEvent.click(closeIcon);
      expect(props.bubbleUp).toHaveBeenCalledTimes(1);
      expect(props.bubbleUp).toBeCalledWith({
        input: ['normandy.request_time'],
      });
    });
  });

  describe('<SampingInput>', () => {
    // Deliberately commented out for now.
    // In Antd the <Select/> component is actually a special <div> construct and not a
    // pretty version of regular <select><option/>..
    // Because of that it's very hard to successfully manage to click and select something.
    // Basically, I could never get this test to pass but I'm keeping the attempt for
    // a day when this gets easier or we get more seasoned with Ant and
    // react-testing-library.
    // it('happy path with blank default inmput', () => {
    //   const props = {
    //     disabled: false,
    //     onChange: jest.fn(),
    //     value: {},
    //   };
    //   const FakeForm = createForm({})(SamplingInput);
    //   const { container, getByLabelText, queryByText, getByText, debug } = render(
    //     <FakeForm {...props} />,
    //   );
    //   fireEvent.click(container.querySelector('div.ant-select'));
    //   // const bucketChoice = queryByText('Bucket');
    //   fireEvent.click(queryByText('Bucket'));
    //   debug();
    //   // const option = queryByText('Bucket');
    //   // const dropdown = queryByText('None');
    //   // debug(dropdown);
    //   // debug(dropdown.parentElement.parentElement);
    //   // fireEvent.keyDown(dropdown);
    // });

    it('should be possible to edit bucket sampling', () => {
      const props = {
        disabled: false,
        onChange: jest.fn(),
        value: {
          type: 'bucketSample',
          start: 50,
          count: 70,
          total: 90,
        },
        onSubmit: jest.fn(), // otherwise set by createForm()
      };
      const FakeForm = createForm({})(SamplingInput);
      const { getByValue } = render(<FakeForm {...props} />);
      fireEvent.change(getByValue('50'), {
        target: { value: '55' },
      });
      expect(props.onChange).toHaveBeenCalledTimes(1);
      expect(props.onChange).toBeCalledWith({
        count: 70,
        start: 55,
        total: 90,
        type: 'bucketSample',
      });
    });

    it('should be possible to edit stable sampling', () => {
      const props = {
        disabled: false,
        onChange: jest.fn(),
        value: {
          type: 'stableSample',
          rate: 0.3333,
        },
        onSubmit: jest.fn(), // otherwise set by createForm()
      };
      const FakeForm = createForm({})(SamplingInput);
      const { getByValue } = render(<FakeForm {...props} />);
      fireEvent.change(getByValue('33%'), {
        target: { value: '75' },
      });
      expect(props.onChange).toHaveBeenCalledTimes(1);
      expect(props.onChange).toBeCalledWith({
        rate: 0.75,
        type: 'stableSample',
      });
    });
  });

  describe('<VersionsInput>', () => {
    it('should be possible to add a version', () => {
      const props = {
        disabled: false,
        onChange: jest.fn(),
        value: [],
        onSubmit: jest.fn(), // otherwise set by createForm()
      };

      const FakeForm = createForm({})(VersionsInput);
      const { getByValue, container } = render(<FakeForm {...props} />);

      // If you enter some junk the submit button will be disabled.
      const firstInput = getByValue('');
      fireEvent.change(firstInput, {
        target: { value: 'junk' },
      });
      const button = container.querySelector('button[type="button"]');
      expect(button.disabled).toBeTruthy();
      fireEvent.click(button);
      expect(props.onChange).toHaveBeenCalledTimes(0);

      // Now put something acceptable in
      fireEvent.change(firstInput, {
        target: { value: '75' },
      });
      expect(button.disabled).toBeFalsy();
      fireEvent.click(button);
      expect(props.onChange).toHaveBeenCalledTimes(1);
      expect(props.onChange).toBeCalledWith([75]);
    });

    it('should be possible to remove a version', () => {
      const props = {
        disabled: false,
        onChange: jest.fn(),
        value: [67, 68, 69],
        onSubmit: jest.fn(), // otherwise set by createForm()
      };
      const FakeForm = createForm({})(VersionsInput);
      const { getByText } = render(<FakeForm {...props} />);
      const tag = getByText('67');
      const closeIcon = tag.querySelector('.anticon-close');
      fireEvent.click(closeIcon);
      expect(props.onChange).toBeCalledWith([68, 69]);
    });
  });
});

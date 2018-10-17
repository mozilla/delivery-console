/* eslint-disable react/jsx-boolean-value */
import {
  AutoComplete,
  Button,
  Checkbox,
  Col,
  Icon,
  InputNumber,
  Row,
  Select,
  Tabs,
  Tag,
} from 'antd';
import { fromJS, List, Map } from 'immutable';
import PropTypes from 'prop-types';
import React from 'react';

import QueryRecipeFilters from 'console/components/data/QueryRecipeFilters';
import FormItem from 'console/components/forms/FormItem';

// XXX Why is this needed?!?
const TabsPane = Tabs.TabPane;
const CheckboxGroup = Checkbox.Group;
const Option = Select.Option;

// Every filter object is an Map (in an List) that looks something like this:
//  {"type": "channel", "channels": ["beta"]}
// We need a mapping from "channel" to "channels", for each, to know what to
// call it when we serialize this list into a Map where entries look like this:
//  {"channels": ["beta"]}
// It is not safe to assume that the "type" can just be the plural form of the word.
export const MAPPING = {
  channel: 'channels',
  country: 'countries',
  locale: 'locales',
  version: 'versions',
};

// In the UI we present the labels but in the data structure we store it by its value.
// This mapping needs to be ordered to generate the <Select><Option/><Option/>... components.
// Also, this is used to *display* the human readable version of each type when viewing
// the details of the filter object.
export const SAMPLING_TYPES = [
  { value: 'bucketSample', label: 'Bucket' },
  { value: 'stableSample', label: 'Stable' },
  { value: '', label: 'None' },
];

/* Return a Map from a List.
  Each item in the list is expected to be something like this:

      [{"type": "age", "ages": [1,2,3]}, ]

  Which is then transformed to this:

      {"ages": [1,2,3]}

  The list of valid keys needs to be known in advance. */
export function serializeFilterObjectToMap(list) {
  if (!list) {
    return Map();
  }
  if (!List.isList(list)) {
    throw new Error(`'${list}' (${typeof list}) is not a List`);
  }

  return Map(
    list.map(item => {
      const type = item.get('type');
      if (type === 'bucketSample' || type === 'stableSample') {
        return ['_sampling', item];
      }
      const name = MAPPING[type];
      if (name === undefined) {
        throw new Error(`Not sure how to convert '${type}'`);
      }
      return [name, item.get(name)];
    }),
  );
}

/* Return a List from a Map.
  Each item in the map is expected to be key'ed based on the reverse of the MAPPING
  constant. For example, from a list like this:

       {locales: ["sv", "en-US"], ...}

  Transforms to this:

    [{type: "locale", locales: ["sv", "en-US"]}, ...]

  The list of keys have to be known in advance. */
export function deserializeFilterObjectToList(obj) {
  if (!obj) {
    return List();
  }
  const reverseMapping = Object.assign(
    {},
    ...Object.entries(MAPPING).map(([key, value]) => ({ [value]: key })),
  );
  return fromJS(
    Object.entries(obj)
      .filter(([key, value]) => {
        return value && ((key === '_sampling' && value.type) || !!value.length);
      })
      .map(([key, value]) => {
        if (key === '_sampling') {
          // Special one that needs to be rewritten based on all the keys in the value.
          // The 'value' should have
          return Object.assign({}, value);
        } else {
          const name = reverseMapping[key];
          if (name === undefined) {
            throw new Error(`Key '${key}' no in known mapping.`);
          }
          return { [key]: value, type: name };
        }
      }),
  );
}

class FilterObjectForm extends React.PureComponent {
  static propTypes = {
    allChannels: PropTypes.instanceOf(List),
    allCountries: PropTypes.instanceOf(List),
    allLocales: PropTypes.instanceOf(List),
    disabled: PropTypes.bool,
    filterObject: PropTypes.instanceOf(Map),
    filterObjectErrors: PropTypes.object,
  };

  static defaultProps = {
    allChannels: new List(),
    allCountries: new List(),
    allLocales: new List(),
  };

  allChannelOptions = () => {
    return this.props.allChannels
      .map(channel => {
        return { label: channel.get('value'), value: channel.get('key') };
      })
      .toArray()
      .sort((a, b) => {
        // The reason why we sort my *label* is because that's the only thing presented
        // to users' eyes. What the default sort is or what the order by 'key' is not
        // important to the user.
        if (a.label > b.label) {
          return 1;
        } else if (a.label < b.label) {
          return -1;
        }
        return 0;
      });
  };

  rememberActiveTabKey = key => {
    window.sessionStorage.setItem('filterObjectActiveTabKey', key);
  };

  getDefaultActiveTabKey = default_ => {
    return window.sessionStorage.getItem('filterObjectActiveTabKey') || default_;
  };

  checkVersions = (rule, value, callback) => {
    // Not doing anything here. The trust of validation is ultimately inside the VersionsInput
    // component *and* the server-side checking.
    // This method is remains as a stub in case we later decide to add some last-minute
    // validation and by leaving it we remind ourselves how this magic with
    // getFieldDecorator stuff works.
    callback();
  };

  checkSampling = (rule, value, callback) => {
    // XXX Check that all input fields are filled.
    callback();
  };

  filterOption = (inputValue, option) => {
    // Rather tongue-twistingly, the option.props.value is the "key" (e.g. "en-US")
    // and "name" is "English". That is because of the nomenclature of Antd Select and the
    // fact that "key" is a React attribute to distinguish nodes.
    // Return true if @inputValue is in either. In a smart way.
    const regex = makeAutocompleteRegex(inputValue);
    return regex.test(option.props.value) || regex.test(option.props.name);
  };

  getSettingsCounts = () => {
    // Return an object keyed by 'geo', 'browser', and 'sampling' that counts how many
    // distinct settings have been made there.

    const counts = {
      geo: 0,
      browser: 0,
      sampling: 0,
    };
    const { getFieldValue } = this.props.form;

    function any(key) {
      const value = getFieldValue(`filter_object.${key}`);
      // 'value' here is either undefined, a JS object or a JS array.
      // The task is to conclude if it's truthy.
      // XXX Is there a better utility function for this?
      if (value) {
        return (Array.isArray(value) && !!value.length) || !!Object.keys(value).length;
      }
      return false;
    }
    any('locales') && counts.geo++;
    any('countries') && counts.geo++;
    any('channels') && counts.browser++;
    any('versions') && counts.browser++;
    any('_sampling') && counts.sampling++;
    return counts;
  };

  getFormErrorsByTab = formErrors => {
    // Return an object keyed by 'geo', 'browser', and 'sampling' whose values are
    // true or false depending on their being any current form errors within.
    // distinct settings have been made there.
    const tabs = {
      geo: false,
      browser: false,
      sampling: false,
    };
    if (formErrors._sampling) {
      tabs.sampling = true;
    }
    if (formErrors.filter_object) {
      if (formErrors.filter_object.channels || formErrors.filter_object.versions) {
        tabs.browser = true;
      }
      if (formErrors.filter_object.countries || formErrors.filter_object.locales) {
        tabs.geo = true;
      }
    }
    return tabs;
  };

  render() {
    const { disabled, filterObject } = this.props;
    const { getFieldDecorator, getFieldsValue } = this.props.form;

    const filterObjectErrors = this.props.filterObjectErrors || {};
    // This is where we build up a suitable object to pass to the FormItem
    // components. It's got a very different structure than the filterObjectErrors.
    // Basically, this object it sent to <FormItem/> components and they look up
    // errors based on the "name". E.g. <FormItem name="foo.bar" formErrors={formErrors}>
    // will search for errors in `formErrors.foo.bar`.
    const formErrors = {};
    if (Object.keys(filterObjectErrors).length) {
      // The filter object form errors (i.e. validation errors from the server)
      // comes in an object where each key is a the index number of the filter
      // object *sent*. Suppose that we sent this:
      //   [FilterObjectX, FilterObjectY, FilterObjectZ]
      // and the server responded with:
      //  {1: FormError}
      // then, we know the error lies with 'FilterObjectY'.
      // We need to turn those form errors into an object, keyed by the same
      // way we sent it and using names that are the names we use for <FormItem/>
      // Let's figure this out.
      const filterObjectsAsList = deserializeFilterObjectToList(
        getFieldsValue(['filter_object']).filter_object,
      );
      formErrors.filter_object = {};
      filterObjectsAsList.forEach((filterObject, i) => {
        if (filterObjectErrors[i]) {
          const type = filterObject.get('type');
          if (type === 'bucketSample' || type === 'stableSample') {
            // Put this in the root!
            formErrors._sampling = filterObjectErrors[i];
          } else {
            const name = MAPPING[type];
            formErrors.filter_object[name] = filterObjectErrors[i][name];
          }
        }
      });
    }

    // Now that we have all the active form errors, we can try to extract from these,
    // which *tabs* then have errors in them.
    const formErrorsByTab = this.getFormErrorsByTab(formErrors);

    // This is a simple object for counting how many settings have been set per tab.
    const countSettings = this.getSettingsCounts();

    const initialLocales = filterObject.get('locales', List()).toArray();
    const initialCountries = filterObject.get('countries', List()).toArray();
    const initialChannels = filterObject.get('channels', List()).toArray();
    const initialVersions = filterObject.get('versions', List()).toArray();
    const initialSampling = filterObject.get('_sampling', Map()).toJS();

    const tabLabels = {
      sampling: (
        <span>
          {formErrorsByTab.sampling && <Icon type="warning" theme="outlined" />}
          Sampling ({countSettings.sampling})
        </span>
      ),
      browser: (
        <span>
          {formErrorsByTab.browser && <Icon type="warning" theme="outlined" />}
          Browser ({countSettings.browser})
        </span>
      ),
      geo: (
        <span>
          {formErrorsByTab.geo && <Icon type="warning" theme="outlined" />}
          Geo ({countSettings.geo})
        </span>
      ),
    };

    return (
      <div>
        <QueryRecipeFilters />

        <Tabs
          defaultActiveKey={this.getDefaultActiveTabKey('sampling')}
          onChange={this.rememberActiveTabKey}
        >
          <TabsPane tab={tabLabels.sampling} key="sampling">
            <FormItem
              label=""
              name="filter_object._sampling"
              required={false}
              connectToForm={false}
              formErrors={formErrors}
            >
              {getFieldDecorator('filter_object._sampling', {
                initialValue: initialSampling,
                rules: [{ validator: this.checkSampling }],
              })(<SamplingInput disabled={disabled} formErrors={formErrors} />)}
            </FormItem>
          </TabsPane>
          <TabsPane tab={tabLabels.browser} key="browser">
            <Row gutter={16}>
              <Col span={12}>
                <FormItem
                  label="Channel"
                  name="filter_object.channels"
                  formErrors={formErrors}
                  required={false}
                  rules={[{ required: false }]}
                  initialValue={initialChannels}
                >
                  <CheckboxGroup disabled={disabled} options={this.allChannelOptions()} />
                </FormItem>
              </Col>
              <Col span={12}>
                <FormItem
                  label="Version"
                  name="filter_object.versions"
                  formErrors={formErrors}
                  required={false}
                  connectToForm={false}
                >
                  {getFieldDecorator('filter_object.versions', {
                    initialValue: initialVersions,
                    rules: [{ validator: this.checkVersions }],
                  })(<VersionsInput disabled={disabled} />)}
                </FormItem>
              </Col>
            </Row>
          </TabsPane>
          <TabsPane tab={tabLabels.geo} key="geo">
            <Row gutter={16} type="flex">
              <Col span={12}>
                <FormItem
                  label="Locale"
                  name="filter_object.locales"
                  formErrors={formErrors}
                  required={false}
                  rules={[{ required: false }]}
                  initialValue={initialLocales}
                >
                  <Select
                    disabled={disabled}
                    mode="multiple"
                    allowClear
                    showArrow={false}
                    filterOption={this.filterOption}
                  >
                    {this.props.allLocales.map(locale => {
                      return (
                        <Select.Option
                          key={locale.get('key')}
                          value={locale.get('key')}
                          name={locale.get('value')}
                        >
                          {locale.get('key')} ({locale.get('value')})
                        </Select.Option>
                      );
                    })}
                  </Select>
                </FormItem>
                {/* This little spacer is necessary so that the row extends all the way. */}
                <p> </p>
              </Col>
              <Col span={12}>
                <FormItem
                  label="Country"
                  name="filter_object.countries"
                  formErrors={formErrors}
                  required={false}
                  rules={[{ required: false }]}
                  initialValue={initialCountries}
                >
                  <Select
                    disabled={disabled}
                    mode="multiple"
                    allowClear
                    showArrow={false}
                    filterOption={this.filterOption}
                  >
                    {this.props.allCountries.map(country => {
                      return (
                        <Select.Option
                          key={country.get('key')}
                          value={country.get('key')}
                          name={country.get('value')}
                        >
                          {country.get('value')} ({country.get('key')})
                        </Select.Option>
                      );
                    })}
                  </Select>
                </FormItem>
              </Col>
            </Row>
          </TabsPane>
        </Tabs>
      </div>
    );
  }
}

export default FilterObjectForm;

/**
 * Return an integer or null. Parse it if you have to.
 */
export function parseIntOrNull(number) {
  if (typeof number === 'string') {
    // The problem with parseInt() is that `parseInt('1x2')` becomes `1` and not NaN.
    const asInteger = parseInt(number, 10);
    return (!isNaN(asInteger) && number === asInteger.toString() && asInteger) || null;
  } else if (typeof number === 'number') {
    // Then it's either an integer or a floating point.
    // But it's 123.0 then just return 123 and for 123.1 return null;
    return ((number | 0) === number && number) || null;
  }
  return null;
}

export class VersionsInput extends React.PureComponent {
  MIN_VERSION = 45;

  static propTypes = {
    disabled: PropTypes.bool,
    onChange: PropTypes.func,
    value: PropTypes.array,
  };

  state = {
    newVersions: [],
    number: null,
    probablyValid: false,
    versionInputType: this.INPUT_TYPE_SPECIFIC,
  };

  onChangeNumber = value => {
    this.setState({ number: parseIntOrNull(value) }, this.toggleProbablyValid);
  };

  toggleProbablyValid = () => {
    // Remember, this 'number' is definitely either an integer or null.
    const { number } = this.state;
    const existingVersions = this.props.value;
    const probablyValid =
      number !== null && number >= this.MIN_VERSION && !existingVersions.includes(number);
    this.setState({ probablyValid });
  };

  addInputVersions = event => {
    const { number } = this.state;
    const existingVersions = this.props.value;
    const range = [number];
    // Merge the range being asked to add with the existing versions.
    const merged = [...new Set([...existingVersions, ...range])].sort();
    this.setState({ number: '', probablyValid: false }, () => {
      this.props.onChange(merged);
    });
  };

  removeVersion = version => {
    const versions = this.props.value.filter(v => v !== version);
    this.props.onChange(versions);
  };

  render() {
    const { disabled } = this.props;

    return (
      <div>
        <div>
          <InputNumber
            min={this.MIN_VERSION}
            disabled={disabled}
            onChange={this.onChangeNumber}
            value={this.state.number || ''}
            title={`Must be an integer number of at least ${this.MIN_VERSION}`}
          />
          <Button
            type="primary"
            shape="circle"
            disabled={disabled || !this.state.probablyValid}
            icon="plus"
            onClick={this.addInputVersions}
          />
        </div>

        {this.props.value.map(version => {
          return (
            <Tag closable={!disabled} key={version} onClose={() => this.removeVersion(version)}>
              {version}
            </Tag>
          );
        })}
      </div>
    );
  }
}

export class SamplingInput extends React.PureComponent {
  static propTypes = {
    disabled: PropTypes.bool,
    value: PropTypes.object,
    // The reason this can't be `.isRequired` (even though it is!) is because
    // getFieldDecorator is weird. It never actually calls the component without first
    // adding the extra props `onChange` and `value` but because you spell it out as
    // the argument to the partial call of getFieldDecorator you get prop type warnings.
    // See https://codesandbox.io/s/r51k0y1y5p for an exanple. If you watch the console
    // you should see a `Failed prop type: The prop `onChange` is marked as required...`
    // but the component is actually never rendered without that prop.
    // Just weird! That's why these implicit props are NOT required.
    onChange: PropTypes.func,
  };

  static defaultProps = {
    formErrors: {},
  };

  bubbleUp = newData => {
    this.props.onChange(Object.assign({}, this.props.value, newData));
  };

  typeChange = type => {
    if (type) {
      // If you switched input type, it's highly likely that you want to keep the
      // inputs you had earlier. Bold assumption.
      const defaultInputs = this.props.value.input || [];
      this.props.onChange({ type, input: defaultInputs });
    } else {
      this.props.onChange({});
    }
  };

  formItemLayout = {
    labelCol: { span: 4 },
    wrapperCol: { span: 14 },
  };

  renderBucketInputs = () => {
    const { disabled, value, formErrors } = this.props;
    return (
      <div>
        <FormItem
          label="Start"
          name="_sampling.start"
          required={true}
          connectToForm={false}
          formErrors={formErrors}
          {...this.formItemLayout}
        >
          <InputNumber
            min={0}
            disabled={disabled}
            onChange={value => {
              this.bubbleUp({ start: value });
            }}
            value={value.start !== undefined ? value.start : ''}
          />
        </FormItem>
        <FormItem
          label="Count"
          name="_sampling.count"
          required={true}
          connectToForm={false}
          formErrors={formErrors}
          {...this.formItemLayout}
        >
          <InputNumber
            min={0}
            disabled={disabled}
            onChange={value => {
              this.bubbleUp({ count: value });
            }}
            value={value.count !== undefined ? value.count : ''}
          />
        </FormItem>
        <FormItem
          label="Total"
          name="_sampling.total"
          required={true}
          connectToForm={false}
          formErrors={formErrors}
          {...this.formItemLayout}
        >
          <InputNumber
            min={0}
            disabled={disabled}
            onChange={value => {
              this.bubbleUp({ total: value });
            }}
            value={value.total !== undefined ? value.total : ''}
          />
        </FormItem>

        <InputsWidget
          disabled={disabled}
          value={value}
          formErrors={formErrors}
          bubbleUp={this.bubbleUp}
          formItemLayout={this.formItemLayout}
        />
      </div>
    );
  };

  renderStableInputs = () => {
    const { disabled, value, formErrors } = this.props;

    return (
      <div>
        <FormItem
          label="Rate"
          name="_sampling.rate"
          required={true}
          connectToForm={false}
          formErrors={formErrors}
          {...this.formItemLayout}
        >
          <InputNumber
            min={0}
            max={100}
            disabled={disabled}
            title="Value between 1 and 100"
            formatter={value => `${value}%`}
            parser={value => value.replace('%', '')}
            onChange={value => {
              this.bubbleUp({ rate: value / 100 });
            }}
            value={(value.rate !== undefined && Math.trunc(value.rate * 100)) || ''}
          />
        </FormItem>
        <InputsWidget
          disabled={disabled}
          value={value}
          formErrors={formErrors}
          bubbleUp={this.bubbleUp}
          formItemLayout={this.formItemLayout}
        />
      </div>
    );
  };

  render() {
    const { disabled } = this.props;
    return (
      <div>
        <FormItem
          label="Type"
          name="_sampling.type"
          required={false}
          connectToForm={false}
          {...this.formItemLayout}
        >
          <Select
            disabled={disabled}
            style={{ width: 200 }}
            value={this.props.value.type || ''}
            onChange={this.typeChange}
          >
            {SAMPLING_TYPES.map(samplingType => {
              return (
                <Option value={samplingType.value} key={samplingType.value}>
                  {samplingType.label}
                </Option>
              );
            })}
          </Select>
        </FormItem>
        {this.props.value.type === 'bucketSample' ? this.renderBucketInputs() : null}
        {this.props.value.type === 'stableSample' ? this.renderStableInputs() : null}
      </div>
    );
  }
}

function makeAutocompleteRegex(value) {
  const escaped = value.replace(/[-/\\^$*+?.()|[\]{}]/g, '\\$&');
  return new RegExp(`\\b${escaped}`, 'gi');
}

export function rewriteSamplingInput(input, defaultOptions) {
  // If you chosen your own input and ignored any of the suggestions and that input is
  // not a number or something that looks like an identifier, assume it to a string that
  // needs to be quoted.
  if (
    !defaultOptions.includes(input) &&
    isNaN(parseInt(input, 10)) &&
    (/\s/.test(input) || !/\./.test(input))
  ) {
    input = `"${input}"`;
  }
  // This that are just numbers are converted to true integers.
  if (!isNaN(parseInt(input, 10))) {
    input = parseInt(input, 10);
  }
  return input;
}

export class InputsWidget extends React.PureComponent {
  state = {
    inputSearch: '',
    probablyValid: false,
  };

  static propTypes = {
    disabled: PropTypes.bool,
    bubbleUp: PropTypes.func.isRequired,
    value: PropTypes.object,
    formItemLayout: PropTypes.object.isRequired,
    defaultInputOptions: PropTypes.array,
  };

  static defaultProps = {
    formItemLayout: {
      labelCol: { span: 4 },
      wrapperCol: { span: 14 },
    },
    formErrors: {},
    defaultInputOptions: ['normandy.recipe.id', 'normandy.userId'],
  };

  onSelectSamplingInput = value => {
    const inputs = this.props.value.input || [];
    inputs.push(value);
    inputs.sort((inputA, inputB) => {
      const smallA = (typeof inputA === 'string' && inputA.toLowerCase()) || inputA.toString();
      const smallB = (typeof inputB === 'string' && inputB.toLowerCase()) || inputB.toString();
      if (smallA > smallB) {
        return 1;
      } else if (smallA < smallB) {
        return -1;
      }
      return 0;
    });
    this.setState({ inputSearch: '', probablyValid: false }, () => {
      this.props.bubbleUp({ input: inputs });
    });
  };

  onSubmitSamplingInput = () => {
    // The function rewriteSamplingInput might change the input to make it look like a
    // string string. I.e. if the input is 'foobar' the output becomes '"foobar"'.
    this.onSelectSamplingInput(
      rewriteSamplingInput(this.state.inputSearch.trim(), this.props.defaultInputOptions),
    );
  };

  removeInput = value => {
    const inputs = this.props.value.input.filter(input => input !== value);
    this.props.bubbleUp({ input: inputs });
  };

  onSearchInput = value => {
    // Reason for keeping this as local state is to be able to clear it when something
    // is chosen.
    let probablyValid = !!value.trim();
    const existingValues = this.props.value.input;
    if (existingValues && probablyValid) {
      const newValue = rewriteSamplingInput(value, this.props.defaultInputOptions);
      probablyValid &= !existingValues.includes(newValue);
    }

    this.setState({ inputSearch: value, probablyValid });
  };

  filterOption = (inputValue, option) => {
    const regex = makeAutocompleteRegex(inputValue);
    return regex.test(option.props.children);
  };

  render() {
    const { value, disabled, formErrors } = this.props;

    const inputs = value.input || [];
    const inputOptions = this.props.defaultInputOptions.filter(opt => {
      return !inputs.includes(opt);
    });
    return (
      <FormItem
        label="Input"
        name="_sampling.input"
        formErrors={formErrors}
        required={true}
        connectToForm={false}
        {...this.props.formItemLayout}
      >
        <AutoComplete
          dataSource={inputOptions}
          style={{ width: 200 }}
          onChange={this.onSearchInput}
          disabled={disabled}
          value={this.state.inputSearch}
          filterOption={this.filterOption}
          allowClear={true}
        />
        <Button
          type="primary"
          shape="circle"
          disabled={disabled || !this.state.probablyValid}
          icon="plus"
          onClick={this.onSubmitSamplingInput}
        />

        <br />
        {inputs.map(input => {
          return (
            <Tag closable={!disabled} key={input} onClose={() => this.removeInput(input)}>
              {input}
            </Tag>
          );
        })}
      </FormItem>
    );
  }
}

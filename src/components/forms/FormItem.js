import { Form } from 'antd';
import autobind from 'autobind-decorator';
import PropTypes from 'prop-types';
import React from 'react';

import { connectFormProps } from 'console/utils/forms';

/**
 * Convenience wrapper for Form.Item and form.getFieldDecorator. This component
 * relies on the context from the createForm decorator and can only be used with
 * children of a component wrapped by it.
 *
 * NOTE: Form.getFieldDecorator tracks when its children are unmounted
 * using refs, which are not supported by stateless functional components.
 * Because of this, the child passed to FormItem must be a class-based
 * component.
 */
@autobind
@connectFormProps
class FormItem extends React.PureComponent {
  static propTypes = {
    // The input component used to enter data for this field.
    children: PropTypes.node.isRequired,

    // Extra config arguments to pass to form.getFieldDecorator.
    config: PropTypes.object,

    // If false, do not wrap the input component with form.getFieldDecorator.
    // Defaults to true.
    connectToForm: PropTypes.bool,

    // From connectFormProps
    form: PropTypes.object.isRequired,
    formErrors: PropTypes.object.isRequired,

    // Convenience alias for initialValue argument to form.getFieldDecorator.
    initialValue: PropTypes.any,

    // The field name where data for this field is stored (passed to
    // form.getFieldDecorator).
    name: PropTypes.string,

    // List of validation rules (passed to form.getFieldDecorator).
    rules: PropTypes.arrayOf(PropTypes.object),

    // If true, automatically trim whitespace from the value.
    trimWhitespace: PropTypes.bool,
  };

  static defaultProps = {
    config: {},
    connectToForm: true,
    initialValue: null,
    name: null,
    rules: [{ required: true, message: 'This field is required.' }],
    trimWhitespace: false,
  };

  static trimValue(event) {
    // InputNumber passes the value as the parameter,
    // but Input passes it via event.target.value.
    let value = event;
    if (event && event.target) {
      value = event.target.value;
    }
    return value.trim();
  }

  renderErrorList(errors) {
    return (
      <ul className="error-list">
        {Object.entries(errors).map(([k, v]) => {
          let formattedValue = v;

          if (v instanceof Array) {
            formattedValue = v.join(' ');
          } else if (typeof v === 'object') {
            formattedValue = this.renderErrorList(v);
          }

          return (
            <li key={k}>
              <code>{k}</code> {formattedValue}
            </li>
          );
        })}
      </ul>
    );
  }

  render() {
    const {
      children,
      config,
      connectToForm,
      form,
      formErrors,
      initialValue,
      name,
      rules,
      trimWhitespace,
      ...customItemProps
    } = this.props;

    if (trimWhitespace) {
      if (config.getValueFromEvent) {
        throw Error(
          'config.getValueFromEvent is already defined, do not also use trimWhitespace.',
        );
      }
    }

    const defaultItemProps = {};
    const error = (name || '')
      .split('.')
      .reduce((obj, index) => (obj ? obj[index] : undefined), formErrors);

    if (error) {
      let help = error;

      if (error instanceof Array) {
        help = error.join(' ');
      } else if (typeof error === 'object') {
        help = this.renderErrorList(error);
      }

      defaultItemProps.help = help;
      defaultItemProps.validateStatus = 'error';
    }
    const itemProps = { ...defaultItemProps, ...customItemProps };

    let field = children;
    if (connectToForm && name) {
      const fieldDecoratorArgs = { initialValue, rules, ...config };
      if (trimWhitespace) {
        fieldDecoratorArgs.getValueFromEvent = FormItem.trimValue;
      }
      field = form.getFieldDecorator(name, fieldDecoratorArgs)(children);
    }

    return (
      <Form.Item {...itemProps} colon={false}>
        {field}
      </Form.Item>
    );
  }
}

export default FormItem;

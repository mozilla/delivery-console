import WrappedFormItem from 'console/components/forms/FormItem';
import { render } from '@testing-library/react';

const FormItem = WrappedFormItem.wrappedComponent;

function createFakeEvent(string) {
  return { target: { value: string } };
}

describe('<FormItem>', () => {
  const props = {
    children: <input type="text" />,
    config: {},
    connectToForm: true,
    form: {},
    formErrors: {},
    initialValue: null,
    name: null,
    rules: null,
  };

  it('should work', () => {
    const { container } = render(<FormItem {...props} />);
    const input = container.querySelector('input[type="text"]');
    expect(input).not.toBeNull();
  });

  it('should correctly trim whitespace', () => {
    const whitespaceBefore = createFakeEvent('   foobar');
    const whitespaceAfter = createFakeEvent('foobar   ');
    const noWhitespace = createFakeEvent('foobar');

    const expectedValue = 'foobar';
    expect(FormItem.trimValue(whitespaceBefore)).toBe(expectedValue);
    expect(FormItem.trimValue(whitespaceAfter)).toBe(expectedValue);
    expect(FormItem.trimValue(noWhitespace)).toBe(expectedValue);
  });

  it('should not trim whitespace from the middle of a string', () => {
    const whitespaceMiddleString = 'foo    bar';
    const whiteSpaceMiddleEvent = createFakeEvent(whitespaceMiddleString);

    expect(FormItem.trimValue(whiteSpaceMiddleEvent)).toBe(whitespaceMiddleString);
  });
});

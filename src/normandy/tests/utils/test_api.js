import APIClient, { APIError } from 'normandy/utils/api';

describe('APIClient util', () => {
  test('should work', () => {
    const wrapper = () => new APIClient();
    expect(wrapper).not.toThrow();
  });
});

describe('APIError', () => {
  test('should identify as an APIError', () => {
    const errMessage = 'Danger, Will Robinson! Danger!';
    const errData = { danger: true };
    let didThrow = false;

    try {
      throw new APIError(errMessage, errData);
    } catch (e) {
      didThrow = true;
      expect(e.name).toBe('APIError');
      expect(e.message).toBe(errMessage);
      expect(e.data).toBe(errData);
    }

    expect(didThrow).toBe(true);
  });
});

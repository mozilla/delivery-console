import { RequestError } from 'console/utils/request';

describe('RequestError', () => {
  it('should identify as an RequestError', () => {
    const errMessage = 'Danger, Will Robinson! Danger!';
    const errData = { danger: true };
    let didThrow = false;

    try {
      throw new RequestError(errMessage, errData);
    } catch (e) {
      didThrow = true;
      expect(e.name).toBe('RequestError');
      expect(e.message).toBe(errMessage);
      expect(e.data).toBe(errData);
    }

    expect(didThrow).toBe(true);
  });
});

import APIClient from 'console/utils/api';

describe('APIClient util', () => {
  it('should work', () => {
    const wrapper = () => new APIClient();
    expect(wrapper).not.toThrow();
  });
});

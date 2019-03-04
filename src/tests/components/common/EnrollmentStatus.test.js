import EnrollmentStatus from 'console/components/common/EnrollmentStatus';
import { wrapMockStore } from 'console/tests/mockStore';

const baseRevision = {
  recipe: {
    id: 1,
  },
};

describe('<EnrollmentStatus>', () => {
  it('should work', () => {
    const wrapper = () =>
      mount(wrapMockStore(<EnrollmentStatus currentRevision={baseRevision} />));
    expect(wrapper).not.toThrow();
  });

  it('should print `disabled` if the recipe is not enabled', () => {
    const revision = { ...baseRevision, enabled: false };
    const wrapper = mount(wrapMockStore(<EnrollmentStatus currentRevision={revision} />));
    expect(wrapper.text()).toContain('Disabled');

    // throw new Error('asdf ' + wrapper.html)
    expect(wrapper.find('i.status-icon').props().className).toContain('anticon-minus');
  });

  it('should print `active` if the recipe is enabled and NOT paused', () => {
    const revision = { ...baseRevision, enabled: true, arguments: { isEnrollmentPaused: false } };
    const wrapper = mount(wrapMockStore(<EnrollmentStatus currentRevision={revision} />));
    expect(wrapper.text()).toContain('Active');
    expect(wrapper.find('i.status-icon').props().className).toContain('anticon-check');
  });

  it('should print `paused` if the recipe is enabled and paused', () => {
    const revision = { ...baseRevision, enabled: true, arguments: { isEnrollmentPaused: true } };
    const wrapper = mount(wrapMockStore(<EnrollmentStatus currentRevision={revision} />));
    expect(wrapper.text()).toContain('Paused');
    expect(wrapper.find('i.status-icon').props().className).toContain('anticon-pause');
  });

  it('should add a "lowkey" class when the recipe is disabled', () => {
    const revision = { ...baseRevision, enabled: false };
    const wrapper = mount(wrapMockStore(<EnrollmentStatus currentRevision={revision} />));
    expect(wrapper.find('NavLink.status-link').props().className).toContain('is-lowkey');
  });

  it('should say Approved for those with an approved approval request', () => {
    const revision = {
      ...baseRevision,
      enabled: false,
      approval_request: {
        approved: true,
      },
    };
    const wrapper = mount(wrapMockStore(<EnrollmentStatus currentRevision={revision} />));
    expect(wrapper.text()).toContain('Approved');
    expect(wrapper.find('i.status-icon').props().className).toContain('is-warning');
  });
});

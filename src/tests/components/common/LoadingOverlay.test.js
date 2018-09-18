import { Spin } from 'antd';
import LoadingOverlay, { SimpleLoadingOverlay } from 'console/components/common/LoadingOverlay';

describe('<SimpleLoadingOverlay>', () => {
  const props = {
    children: <div id="content">Hello world!</div>,
    isVisible: false,
  };

  it('should work', () => {
    const wrapper = () => shallow(<SimpleLoadingOverlay {...props} />);

    expect(wrapper).not.toThrow();
  });

  it('should display a Spin element while visible', () => {
    const wrapper = mount(<SimpleLoadingOverlay {...props} isVisible />);

    expect(wrapper.find(Spin).length).toBe(1);
    expect(wrapper.find('#content').length).toBe(1);
  });

  it('should display its children when NOT visible', () => {
    const wrapper = mount(<SimpleLoadingOverlay {...props} isVisible={false} />);

    expect(wrapper.find(Spin).length).toBe(1);
    expect(wrapper.find('#content').length).toBe(1);
  });
});

describe('<LoadingOverlay>', () => {
  const { WrappedComponent: TestOverlay } = LoadingOverlay;

  const props = {
    children: <div id="content">Hello world!</div>,
    isLoading: false,
    requestIds: 'content',
  };

  it('should work', () => {
    const wrapper = () => shallow(<TestOverlay {...props} />);

    expect(wrapper).not.toThrow();
  });

  it('should display a Spin element while loading', () => {
    const wrapper = mount(<TestOverlay {...props} isLoading />);
    expect(wrapper.find(Spin).props().spinning).toBeTruthy();
    expect(wrapper.find('#content').length).toBe(1);
  });

  it('should display its children when NOT loading', () => {
    const wrapper = mount(<TestOverlay {...props} isLoading={false} />);

    expect(wrapper.find(Spin).props().spinning).toBeFalsy();
    expect(wrapper.find('#content').length).toBe(1);
  });
});

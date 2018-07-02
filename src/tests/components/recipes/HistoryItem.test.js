import { Timeline } from 'antd';
import { fromJS, Map } from 'immutable';
import {
  REVISION_APPROVED,
  REVISION_DISABLED,
  REVISION_LIVE,
  REVISION_PENDING_APPROVAL,
  REVISION_REJECTED,
} from 'console/state/constants';
import { wrapMockStore } from 'console/tests/mockStore';

import TestComponent, {
  HistoryItemPopover,
  RevisionInfo,
  RequestInfo,
  ApprovalComment,
} from 'console/components/recipes/HistoryItem';
import { NavLink } from 'react-router-dom';

const { WrappedComponent: HistoryItem } = TestComponent;

describe('<HistoryItem>', () => {
  it('should work', () => {
    const props = {
      isLatestRevision: () => {},
      revision: new Map(),
      selectedRevisionId: 123,
      recipeId: 234,
      revisionNo: 6,
    };

    const wrapper = () => mount(wrapMockStore(<HistoryItem {...props} />));

    expect(wrapper).not.toThrow();
  });

  describe('should display the correct status', () => {
    const props = {
      isLatestRevision: () => {},
      revision: new Map({
        id: 123,
      }),
      recipeId: 234,
      revisionNo: 6,
    };

    const testStatusStyle = (status, color, iconType, label) => {
      const wrapper = mount(
        wrapMockStore(<HistoryItem {...props} status={status} selectedRevisionId={0} />),
      );

      const el = wrapper.find(Timeline.Item);
      expect(el.props().color).toBe(color);
      expect(el.props().dot.props.type).toBe(iconType);
      expect(el.props().dot.props.color).toBe(color);
      expect(wrapper.find(NavLink).length).toBe(2);
      expect(
        wrapper
          .find(NavLink)
          .at(1)
          .text(),
      ).toBe(label);
    };

    it('should use a fallback "bland" style when no status was provided', () => {
      const wrapper = mount(wrapMockStore(<HistoryItem {...props} selectedRevisionId={0} />));

      const el = wrapper.find(Timeline.Item);
      expect(el.props().color).toBe('grey');
      expect(el.props().dot).toBe(null);
      expect(wrapper.find(NavLink).length).toBe(1);
    });

    it('should use a "live" style when the status is REVISION_LIVE', () => {
      testStatusStyle(REVISION_LIVE, 'green', 'check-circle', 'Live');
    });

    it('should use a "disabled" style when the status is REVISION_DISABLED', () => {
      testStatusStyle(REVISION_DISABLED, 'red', 'close-circle', 'Disabled');
    });

    it('should use a "approved" style when the status is REVISION_APPROVED', () => {
      testStatusStyle(REVISION_APPROVED, 'green', 'check-circle', 'Approved');
    });

    it('should use a "rejected" style when the status is REVISION_REJECTED', () => {
      testStatusStyle(REVISION_REJECTED, 'red', 'close-circle', 'Rejected');
    });

    it('should use a "pending approval" style when the status is REVISION_PENDING_APPROVAL', () => {
      testStatusStyle(REVISION_PENDING_APPROVAL, 'gold', 'clock-circle-o', 'Pending Approval');
    });
  });

  describe('selected revisions', () => {
    const props = {
      isLatestRevision: () => {},
      revision: new Map({
        id: 123,
      }),
      recipeId: 234,
      revisionNo: 6,
    };

    it('should highlight when it is the selected revision', () => {
      const wrapper = mount(wrapMockStore(<HistoryItem {...props} selectedRevisionId={123} />));

      // We can test against the Timeline.Item inheritting proper visual styles.
      const el = wrapper.find(Timeline.Item);
      expect(el.length).toBe(1);
      expect(el.props().color).toBe('blue');

      // `dot` is an Icon which should be highlighted with the appropriate icon.
      expect(el.props().dot).toBeTruthy();
      expect(el.props().dot.props.type).toBe('circle-left');
      expect(el.props().dot.props.color).toBe('blue');
    });

    it('should NOT highlight when it is NOT the selected revision', () => {
      const wrapper = mount(wrapMockStore(<HistoryItem {...props} selectedRevisionId={234} />));

      const el = wrapper.find(Timeline.Item);
      expect(el.length).toBe(1);
      expect(el.props().color).not.toBe('blue');
      expect(el.props().dot).toBe(null);
    });
  });

  describe('<HistoryItemPopover>', () => {
    const props = {
      revision: new Map(),
    };

    it('should work', () => {
      const wrapper = () => mount(<HistoryItemPopover {...props} />);

      expect(wrapper).not.toThrow();
    });

    it('should show RevisionInfo by default', () => {
      const wrapper = mount(<HistoryItemPopover {...props} />);

      // Determine that the RevisionInfo is rendering an element.
      expect(wrapper.find(RevisionInfo).length).toBe(1);
      expect(wrapper.find(RevisionInfo).children().length).not.toBe(0);

      // Confirm the others aren't rendering.
      expect(wrapper.find(RequestInfo).children().length).toBe(0);
      expect(wrapper.find(ApprovalComment).children().length).toBe(0);
    });

    it('should show RequestInfo if a request is open', () => {
      const revision = fromJS({ approval_request: {} });
      const wrapper = mount(<HistoryItemPopover revision={revision} />);

      expect(wrapper.find(RevisionInfo).children().length).not.toBe(0);
      expect(wrapper.find(RequestInfo).children().length).not.toBe(0);

      expect(wrapper.find(ApprovalComment).children().length).toBe(0);
    });

    it('should show an ApprovalComment if a request was responded to', () => {
      const revision = fromJS({ approval_request: { approved: true } });
      const wrapper = mount(<HistoryItemPopover revision={revision} />);

      expect(wrapper.find(RevisionInfo).children().length).not.toBe(0);
      expect(wrapper.find(RequestInfo).children().length).not.toBe(0);
      expect(wrapper.find(ApprovalComment).children().length).not.toBe(0);
    });
  });

  describe('<RevisionInfo>', () => {
    const props = {
      revision: new Map(),
    };

    it('should work', () => {
      const wrapper = () => mount(<RevisionInfo {...props} />);

      expect(wrapper).not.toThrow();
    });
  });

  describe('<RequestInfo>', () => {
    const props = {
      revision: new Map(),
    };

    it('should work', () => {
      const wrapper = () => mount(<RequestInfo {...props} />);

      expect(wrapper).not.toThrow();
    });
  });

  describe('<ApprovalComment>', () => {
    const props = {
      revision: new Map(),
    };

    it('should work', () => {
      const wrapper = () => mount(<ApprovalComment {...props} />);

      expect(wrapper).not.toThrow();
    });
  });
});

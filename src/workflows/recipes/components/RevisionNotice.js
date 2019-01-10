import { Alert } from 'antd';
import PropTypes from 'prop-types';
import React from 'react';
import { connect } from 'react-redux';

import {
  REVISION_APPROVED,
  REVISION_DRAFT,
  REVISION_LIVE,
  REVISION_PENDING_APPROVAL,
  REVISION_OUTDATED,
  REVISION_REJECTED,
} from 'console/state/constants';
import { getRevisionDraftStatus, getRevisionStatus } from 'console/state/revisions/selectors';

@connect((state, { revision }) => ({
  draftStatus: getRevisionDraftStatus(state, revision.get('id')),
  status: getRevisionStatus(state, revision.get('id')),
}))
class RevisionNotice extends React.Component {
  static propTypes = {
    draftStatus: PropTypes.string,
    status: PropTypes.string,
  };

  // THIS SHOULDN'T BE NECESSARY
  // https://github.com/mozilla/delivery-console/issues/680
  shouldComponentUpdate(nextProps) {
    const { draftStatus, status } = this.props;
    return nextProps.draftStatus !== draftStatus || nextProps.status !== status;
  }

  render() {
    const { draftStatus, status } = this.props;

    let message;
    let type;

    if (status === REVISION_PENDING_APPROVAL) {
      message = 'You are viewing a draft that is pending approval.';
      type = 'warning';
    } else if (status === REVISION_REJECTED) {
      message = 'You are viewing a draft that was rejected.';
      type = 'warning';
    } else if (draftStatus === REVISION_DRAFT) {
      message = 'You are viewing a draft.';
      type = 'info';
    } else if (draftStatus === REVISION_OUTDATED) {
      message = 'You are viewing an outdated version.';
      type = 'info';
    } else if (status === REVISION_LIVE) {
      message = 'This is the published version.';
      type = 'success';
    } else if (status === REVISION_APPROVED) {
      message = 'You are viewing a draft that has been approved but has not been published.';
      type = 'warning';
    } else {
      return null;
    }

    return <Alert className="revision-notice" type={type} message={message} showIcon />;
  }
}

export default RevisionNotice;

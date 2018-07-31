import { Alert, Icon, Popover, Tag, Timeline } from 'antd';
import autobind from 'autobind-decorator';
import dateFns from 'date-fns';
import { Map } from 'immutable';
import PropTypes from 'prop-types';
import React from 'react';
import { connect } from 'react-redux';
import { NavLink } from 'react-router-dom';

import {
  REVISION_APPROVED,
  REVISION_DISABLED,
  REVISION_LIVE,
  REVISION_PENDING_APPROVAL,
  REVISION_REJECTED,
} from 'console/state/constants';
import {
  getRevisionStatus,
  isLatestRevision as isLatestRevisionSelector,
} from 'console/state/revisions/selectors';
import { reverse } from 'console/urls';

@connect((state, { revision }) => ({
  status: getRevisionStatus(state, revision.get('id')),
  isLatestRevision: id => isLatestRevisionSelector(state, id),
}))
@autobind
export default class HistoryItem extends React.PureComponent {
  static propTypes = {
    isLatestRevision: PropTypes.func.isRequired,
    revision: PropTypes.instanceOf(Map).isRequired,
    status: PropTypes.string,
    selectedRevisionId: PropTypes.number.isRequired,
    recipeId: PropTypes.number.isRequired,
    revisionNo: PropTypes.number.isRequired,
  };

  static statusStyles = {
    [REVISION_LIVE]: {
      color: 'green',
      iconType: 'check-circle',
      label: 'Live',
    },
    [REVISION_DISABLED]: {
      color: 'red',
      iconType: 'close-circle',
      label: 'Disabled',
    },
    [REVISION_APPROVED]: {
      color: 'green',
      iconType: 'check-circle',
      label: 'Approved',
    },
    [REVISION_REJECTED]: {
      color: 'red',
      iconType: 'close-circle',
      label: 'Rejected',
    },
    [REVISION_PENDING_APPROVAL]: {
      color: 'gold',
      iconType: 'clock-circle-o',
      label: 'Pending Approval',
    },
  };

  getRevisionStyles() {
    const { revision, status } = this.props;

    // Grab the status style from the static definition, alternatively fall back
    // to empty/'bland' display values.
    const statusInfo = HistoryItem.statusStyles[status] || {};

    let labelColor;
    let { color: iconColor = 'grey', iconType } = statusInfo;

    // If the revision is the currently viewed revision, override the icon and color.
    if (revision.get('id') === this.props.selectedRevisionId) {
      labelColor = 'blue';
      iconColor = labelColor;
      iconType = 'circle-left';
    }

    const icon = !iconType ? null : <Icon type={iconType} style={{ fontSize: '16px' }} />;

    return {
      icon,
      iconColor,
      labelColor,
      statusInfo,
    };
  }

  getRevisionUrl() {
    const { recipeId, revision, isLatestRevision } = this.props;
    const revisionId = revision.get('id');
    return isLatestRevision(revisionId)
      ? reverse('recipes.details', { recipeId })
      : reverse('recipes.revision', { recipeId, revisionId });
  }

  render() {
    const { recipeId, revision, revisionNo } = this.props;
    const revisionUrl = this.getRevisionUrl();

    const { icon, iconColor, labelColor, statusInfo } = this.getRevisionStyles();

    return (
      <Timeline.Item color={iconColor} dot={icon} key={revision.get('id')}>
        <Popover
          overlayClassName="timeline-popover"
          content={<HistoryItemPopover revision={revision} />}
          placement="left"
        >
          <NavLink to={revisionUrl}>
            <Tag color={labelColor}>{`Revision ${revisionNo}`}</Tag>
          </NavLink>

          {statusInfo.label && (
            <NavLink to={reverse('recipes.approval_history', { recipeId })}>
              <Tag className="status-label" color={statusInfo.color}>
                {statusInfo.label}
              </Tag>
            </NavLink>
          )}
        </Popover>
      </Timeline.Item>
    );
  }
}

export class HistoryItemPopover extends React.PureComponent {
  static propTypes = {
    revision: PropTypes.instanceOf(Map).isRequired,
  };

  render() {
    const { revision } = this.props;

    return (
      <div className="revision-info">
        <RevisionInfo revision={revision} />
        <RequestInfo revision={revision} />
        <ApprovalComment revision={revision} />
      </div>
    );
  }
}

export class RevisionInfo extends React.PureComponent {
  static propTypes = {
    revision: PropTypes.instanceOf(Map).isRequired,
  };

  render() {
    const { revision } = this.props;
    const revisionCreationTime = dateFns.parse(revision.get('date_created'));

    const fullTime = dateFns.format(revisionCreationTime, 'MMMM Do YYYY, h:mm a');
    const simpleTime = dateFns.format(revisionCreationTime, 'MM/DD/YYYY');
    const timeAgo = dateFns.distanceInWordsToNow(revisionCreationTime);

    // Creator info is on every tooltip, contains basic metadata.
    return (
      <div>
        Revision added:
        <b title={fullTime}>{` ${simpleTime} `}</b>({timeAgo})
      </div>
    );
  }
}

export class RequestInfo extends React.PureComponent {
  static propTypes = {
    revision: PropTypes.instanceOf(Map).isRequired,
  };

  render() {
    const { revision } = this.props;

    const hasApprovalRequest = !!revision.get('approval_request');

    if (!hasApprovalRequest) {
      return null;
    }

    const requestCreator = revision.getIn(['approval_request', 'creator', 'email']);
    const requestCreationTime = dateFns.parse(revision.getIn(['approval_request', 'created']));

    const fullTime = dateFns.format(requestCreationTime, 'MMMM Do YYYY, h:mm a');
    const simpleTime = dateFns.format(requestCreationTime, 'MM/DD/YYYY');
    const timeAgo = dateFns.distanceInWordsToNow(requestCreationTime);

    return (
      <span>
        <hr />
        Approval requested by: <b>{requestCreator}</b>
        <br />
        Date requested:
        <b title={fullTime}>{` ${simpleTime} `}</b>({timeAgo})
      </span>
    );
  }
}

export class ApprovalComment extends React.PureComponent {
  static propTypes = {
    revision: PropTypes.instanceOf(Map).isRequired,
  };

  render() {
    const { revision } = this.props;
    const isApproved = revision.getIn(['approval_request', 'approved']);
    const hasApprovalStatus = isApproved === true || isApproved === false;

    if (!hasApprovalStatus) {
      return null;
    }

    const approver = revision.getIn(['approval_request', 'approver', 'email']);

    return (
      <span>
        <hr />
        <Alert
          className="request-comment"
          banner
          type={isApproved === true ? 'success' : 'error'}
          showIcon
          message={
            <span>
              <strong>“{revision.getIn(['approval_request', 'comment'])}”</strong>
              <label>— {approver}</label>
            </span>
          }
        />
      </span>
    );
  }
}

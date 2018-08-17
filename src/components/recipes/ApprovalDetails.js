import { format } from 'date-fns/esm';
import { formatDistance } from 'date-fns/esm';
import { toDate } from 'date-fns/esm';
import { Map } from 'immutable';
import PropTypes from 'prop-types';
import React from 'react';

export default class ApprovalDetails extends React.PureComponent {
  static propTypes = {
    request: PropTypes.instanceOf(Map).isRequired,
  };

  render() {
    const { request } = this.props;
    const dateCreated = toDate(request.get('created'));

    return (
      <dl className="details narrow">
        <dt>{request.get('approved') ? 'Approved' : 'Rejected'} by</dt>
        <dd>{request.getIn(['approver', 'email'])}</dd>

        <dt>Responsed</dt>
        <dd title={format(dateCreated, 'MMMM Do YYYY, h:mm a')}>
          {formatDistance(dateCreated, new Date())}
        </dd>

        <dt>Comment</dt>
        <dd>{request.get('comment')}</dd>
      </dl>
    );
  }
}

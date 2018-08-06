import dateFns from 'date-fns';
import { Map } from 'immutable';
import PropTypes from 'prop-types';
import React from 'react';

export default class ApprovalDetails extends React.PureComponent {
  static propTypes = {
    request: PropTypes.instanceOf(Map).isRequired,
  };

  render() {
    const { request } = this.props;
    const dateCreated = dateFns.parse(request.get('created'));

    return (
      <dl className="details narrow">
        <dt>{request.get('approved') ? 'Approved' : 'Rejected'} by</dt>
        <dd>{request.getIn(['approver', 'email'])}</dd>

        <dt>Responsed</dt>
        <dd title={dateFns.format(dateCreated, 'MMMM Do YYYY, h:mm a')}>
          {dateFns.distanceInWordsToNow(dateCreated)}
        </dd>

        <dt>Comment</dt>
        <dd>{request.get('comment')}</dd>
      </dl>
    );
  }
}

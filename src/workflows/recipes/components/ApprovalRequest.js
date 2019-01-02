import { Alert, Card, Col, message, Row, Tag } from 'antd';
import autobind from 'autobind-decorator';
import dateFns from 'date-fns';
import { Map } from 'immutable';
import PropTypes from 'prop-types';
import React from 'react';
import { connect } from 'react-redux';

import { getUserProfile } from 'console/state/auth/selectors';
import handleError from 'console/utils/handleError';
import ApprovalForm from 'console/workflows/recipes/components/ApprovalForm';
import ApprovalDetails from 'console/workflows/recipes/components/ApprovalDetails';
import RecipeDetails from 'console/workflows/recipes/components/RecipeDetails';
import {
  approveApprovalRequest,
  rejectApprovalRequest,
} from 'console/state/approvalRequests/actions';
import {
  getRecipeForRevision,
  isRevisionPendingApproval,
} from 'console/state/revisions/selectors';

@connect(
  (state, { revision }) => ({
    approvalRequest: revision.get('approval_request', new Map()),
    recipe: getRecipeForRevision(state, revision.get('id'), new Map()),
    isPendingApproval: isRevisionPendingApproval(state, revision.get('id')),
    userProfile: getUserProfile(state),
  }),
  {
    approveApprovalRequest,
    rejectApprovalRequest,
  },
)
@autobind
class ApprovalRequest extends React.PureComponent {
  static propTypes = {
    approvalRequest: PropTypes.instanceOf(Map).isRequired,
    approveApprovalRequest: PropTypes.func.isRequired,
    isPendingApproval: PropTypes.bool.isRequired,
    recipe: PropTypes.instanceOf(Map).isRequired,
    rejectApprovalRequest: PropTypes.func.isRequired,
    revision: PropTypes.instanceOf(Map).isRequired,
    userProfile: PropTypes.instanceOf(Map),
  };

  state = {
    formErrors: {},
    isSubmitting: false,
  };

  async handleSubmit(values, context) {
    const { approvalRequest } = this.props;

    this.setState({
      isSubmitting: true,
    });

    let action;
    let successMessage;

    if (context.approved) {
      action = this.props.approveApprovalRequest;
      successMessage = 'Request approved';
    } else {
      action = this.props.rejectApprovalRequest;
      successMessage = 'Request rejected';
    }

    try {
      await action(approvalRequest.get('id'), values);
      message.success(successMessage);
    } catch (error) {
      handleError(`Unable to ${context.approved ? 'approve' : 'reject'} request.`, error);

      if (error.data) {
        this.setState({ formErrors: error.data });
      }
    } finally {
      this.setState({
        isSubmitting: false,
      });
    }
  }

  render() {
    const { isSubmitting } = this.state;
    const { approvalRequest, isPendingApproval, recipe, userProfile } = this.props;
    const errors = this.state.formErrors;

    let extra;

    if (isPendingApproval) {
      extra = <Tag color="gold">Pending Approval</Tag>;
    } else if (approvalRequest.get('approved')) {
      extra = <Tag color="green">Approved</Tag>;
    } else {
      extra = <Tag color="red">Rejected</Tag>;
    }

    let detailSection;
    if (isPendingApproval) {
      // FIXME(peterbe): Replace this with something more advanced that
      // determines *what* you can do.
      if (userProfile) {
        detailSection = (
          <ApprovalForm
            approvalRequest={approvalRequest}
            isSubmitting={isSubmitting}
            onSubmit={this.handleSubmit}
            errors={errors}
          />
        );
      } else {
        detailSection = (
          <Alert
            className="revision-notice"
            type="warning"
            message="Must be logged in take any action on this."
          />
        );
      }
    } else {
      detailSection = <ApprovalDetails request={approvalRequest} />;
    }

    const dateCreated = dateFns.parse(approvalRequest.get('created'));

    return (
      <div className="approval-history-details">
        <Row gutter={24}>
          <Col span={14}>
            <RecipeDetails recipe={recipe} />
          </Col>
          <Col span={10}>
            <Card title="Approval Request" extra={extra}>
              <div className="request-metadata">
                <dl className="details narrow">
                  <dt>Requested by</dt>
                  <dd>{approvalRequest.getIn(['creator', 'email'])}</dd>

                  <dt>Requested</dt>
                  <dd title={dateFns.format(dateCreated, 'MMMM Do YYYY, h:mm a')}>
                    {dateFns.distanceInWordsToNow(dateCreated)}
                  </dd>
                </dl>
              </div>

              <div className="approval-details">{detailSection}</div>
            </Card>
          </Col>
        </Row>
      </div>
    );
  }
}

export default ApprovalRequest;

import { Button, Modal } from 'antd';
import autobind from 'autobind-decorator';
import { Map } from 'immutable';
import PropTypes from 'prop-types';
import React from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';

import { disableRecipe, enableRecipe } from 'console/state/recipes/actions';
import { requestRevisionApproval } from 'console/state/revisions/actions';
import { getLatestRevisionIdForRecipe, getRecipe } from 'console/state/recipes/selectors';
import {
  isApprovableRevision,
  isLatestApprovedRevision,
  isLatestRevision,
  isRevisionPendingApproval,
} from 'console/state/revisions/selectors';
import { getUrlParamAsInt } from 'console/state/router/selectors';
import { reverse } from 'console/urls';

@connect(
  (state, props) => {
    const recipeId = getUrlParamAsInt(state, 'recipeId');
    const latestRevisionId = getLatestRevisionIdForRecipe(state, recipeId, '');
    const recipe = getRecipe(state, recipeId, new Map());
    const revisionId = getUrlParamAsInt(state, 'revisionId', latestRevisionId);

    return {
      isLatest: isLatestRevision(state, revisionId),
      isLatestApproved: isLatestApprovedRevision(state, revisionId),
      isPendingApproval: isRevisionPendingApproval(state, revisionId),
      isApprovable: isApprovableRevision(state, revisionId),
      recipe,
      recipeId,
      revisionId,
    };
  },
  {
    disableRecipe,
    enableRecipe,
    requestRevisionApproval,
  },
)
@autobind
class DetailsActionBar extends React.PureComponent {
  static propTypes = {
    disableRecipe: PropTypes.func.isRequired,
    enableRecipe: PropTypes.func.isRequired,
    isApprovable: PropTypes.bool.isRequired,
    isLatest: PropTypes.bool.isRequired,
    isLatestApproved: PropTypes.bool.isRequired,
    isPendingApproval: PropTypes.bool.isRequired,
    recipe: PropTypes.instanceOf(Map).isRequired,
    recipeId: PropTypes.number.isRequired,
    requestRevisionApproval: PropTypes.func.isRequired,
    revisionId: PropTypes.number.isRequired,
  };

  handleDisableClick() {
    const { recipeId } = this.props;
    const onOk = () => this.props.disableRecipe(recipeId);
    Modal.confirm({
      title: 'Are you sure you want to disable this recipe?',
      onOk: onOk.bind(this),
    });
  }

  handlePublishClick() {
    const { recipeId } = this.props;
    const onOk = () => this.props.enableRecipe(recipeId);
    Modal.confirm({
      title: 'Are you sure you want to publish this recipe?',
      onOk: onOk.bind(this),
    });
  }

  handleRequestClick() {
    const { revisionId } = this.props;
    this.props.requestRevisionApproval(revisionId);
  }

  render() {
    const {
      isApprovable,
      isLatest,
      isLatestApproved,
      isPendingApproval,
      recipe,
      recipeId,
      revisionId,
    } = this.props;

    const cloneUrl = isLatest
      ? reverse('recipes.clone', { recipeId })
      : reverse('recipes.revision.clone', { recipeId, revisionId });

    return (
      <div className="details-action-bar clearfix">
        <Link to={cloneUrl} id="dab-clone-link">
          <Button icon="swap" type="primary" id="dab-clone-button">
            Clone
          </Button>
        </Link>

        {isLatest && (
          <Link to={reverse('recipes.edit', { recipeId })} id="dab-edit-link">
            <Button icon="edit" type="primary" id="dab-edit-button">
              Edit
            </Button>
          </Link>
        )}

        {isApprovable && (
          <Button
            icon="question-circle"
            type="primary"
            onClick={this.handleRequestClick}
            id="dab-request-approval"
          >
            Request Approval
          </Button>
        )}

        {isPendingApproval && (
          <Link to={reverse('recipes.approval_history', { recipeId })}>
            <Button icon="message" type="primary" id="dab-approval-status">
              Approval Request
            </Button>
          </Link>
        )}

        {isLatestApproved &&
          recipe.get('enabled') && (
            <Button
              icon="close-circle"
              type="danger"
              onClick={this.handleDisableClick}
              id="dab-disable"
            >
              Disable
            </Button>
          )}

        {isLatestApproved &&
          !recipe.get('enabled') && (
            <Button
              icon="check-circle"
              type="primary"
              onClick={this.handlePublishClick}
              id="dab-publish"
            >
              Publish
            </Button>
          )}
      </div>
    );
  }
}

export default DetailsActionBar;

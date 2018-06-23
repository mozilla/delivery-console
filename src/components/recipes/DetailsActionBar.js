import { Button, Modal } from 'antd';
import autobind from 'autobind-decorator';
import { Map } from 'immutable';
import PropTypes from 'prop-types';
import React from 'react';
import { connect } from 'react-redux';
import { NavLink } from 'react-router-dom';
import { withRouter } from 'react-router';

import {
  disableRecipe as disableRecipeAction,
  enableRecipe as enableRecipeAction,
} from 'console/state/recipes/actions';
import { requestRevisionApproval as requestRevisionApprovalAction } from 'console/state/revisions/actions';
import { getLatestRevisionIdForRecipe, getRecipe } from 'console/state/recipes/selectors';
import {
  isApprovableRevision,
  isLatestApprovedRevision,
  isLatestRevision,
  isRevisionPendingApproval,
} from 'console/state/revisions/selectors';
import { getCurrentPathname, getUrlParamAsInt } from 'console/state/router/selectors';

@withRouter
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
      routerPath: getCurrentPathname(state),
      recipe,
      recipeId,
      revisionId,
    };
  },
  {
    disableRecipe: disableRecipeAction,
    enableRecipe: enableRecipeAction,
    requestRevisionApproval: requestRevisionApprovalAction,
  },
)
@autobind
export default class DetailsActionBar extends React.PureComponent {
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
    routerPath: PropTypes.string.isRequired,
  };

  handleDisableClick() {
    const { disableRecipe, recipeId } = this.props;
    Modal.confirm({
      title: 'Are you sure you want to disable this recipe?',
      onOk() {
        disableRecipe(recipeId);
      },
    });
  }

  handlePublishClick() {
    const { enableRecipe, recipeId } = this.props;
    Modal.confirm({
      title: 'Are you sure you want to publish this recipe?',
      onOk() {
        enableRecipe(recipeId);
      },
    });
  }

  handleRequestClick() {
    const { requestRevisionApproval, revisionId } = this.props;
    requestRevisionApproval(revisionId);
  }

  render() {
    const {
      isApprovable,
      isLatest,
      isLatestApproved,
      isPendingApproval,
      recipe,
      recipeId,
      routerPath,
    } = this.props;

    return (
      <div className="details-action-bar clearfix">
        <NavLink to={`${routerPath}clone/`} id="dab-clone-link">
          <Button icon="swap" type="primary" id="dab-clone-button">
            Clone
          </Button>
        </NavLink>

        {isLatest && (
          <NavLink to={`/recipe/${recipeId}/edit/`} id="dab-edit-link">
            <Button icon="edit" type="primary" id="dab-edit-button">
              Edit
            </Button>
          </NavLink>
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
          <NavLink to={`/recipe/${recipeId}/approval_history/`}>
            <Button icon="message" type="primary" id="dab-approval-status">
              Approval Request
            </Button>
          </NavLink>
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

import { Icon } from 'antd';
import cx from 'classnames';
import PropTypes from 'prop-types';
import React from 'react';
import { NavLink } from 'react-router-dom';

import { reverse } from 'console/urls';

// Ideally the prop.recipe would be an Immutable Map, but Ant's Table works with
// plain JS objects, which means this component can not be Pure.
export default class EnrollmentStatus extends React.Component {
  static propTypes = {
    currentRevision: PropTypes.object.isRequired,
  };

  getLabel() {
    if (this.isRecipeEnabled()) {
      return this.isRecipePaused() ? 'Paused' : 'Active';
    } else {
      // If it's not enabled (or paused) show something about the approval status.
      if (this.isRecipeApproved()) {
        return 'Approved';
      }
    }
    return 'Disabled';
  }

  isRecipeApproved() {
    const { currentRevision } = this.props;
    return currentRevision.approval_request && currentRevision.approval_request.approved;
  }

  getIcon() {
    if (this.isRecipeEnabled()) {
      return this.isRecipePaused() ? 'pause' : 'check';
    } else if (this.isRecipeApproved()) {
      return 'info-circle';
    }
    return 'minus';
  }

  getColor() {
    if (this.isRecipeEnabled()) {
      return this.isRecipePaused() ? 'is-false' : 'is-true';
    } else if (this.isRecipeApproved()) {
      return 'is-warning';
    }
    return null;
  }

  isRecipePaused() {
    const { currentRevision } = this.props;
    return !currentRevision.enabled || !!currentRevision.arguments.isEnrollmentPaused;
  }

  isRecipeEnabled() {
    const { currentRevision } = this.props;
    return currentRevision.enabled;
  }

  render() {
    const { currentRevision } = this.props;

    return (
      <NavLink
        to={reverse('recipes.details', { recipeId: currentRevision.recipe.id })}
        className={cx(
          'status-link',
          !(this.isRecipeEnabled() || this.isRecipeApproved()) && 'is-lowkey',
        )}
      >
        <Icon className={cx('status-icon', this.getColor())} type={this.getIcon()} />
        <span className="enrollment-label">{this.getLabel()}</span>
      </NavLink>
    );
  }
}

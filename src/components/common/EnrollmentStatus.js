import { Icon } from 'antd';
import cx from 'classnames';
import PropTypes from 'prop-types';
import React from 'react';
import { NavLink } from 'react-router-dom';

import { reverse } from 'console/urls';

// Ideally the prop.recipe would be an Immutable Map, but Ant's Table works with
// plain JS objects, which means this component can not be Pure.
export default class EnrollmentSatus extends React.Component {
  static propTypes = {
    recipe: PropTypes.object.isRequired,
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
    const { recipe } = this.props;
    return recipe.approval_request && recipe.approval_request.approved;
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
    const { recipe } = this.props;
    return !recipe.enabled || !!recipe.arguments.isEnrollmentPaused;
  }

  isRecipeEnabled() {
    const { recipe } = this.props;
    return recipe.enabled;
  }

  render() {
    const { recipe } = this.props;

    return (
      <NavLink
        to={reverse('recipes.details', { recipeId: recipe.id })}
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

/* eslint-disable react/jsx-boolean-value */
import { Select } from 'antd';
import { Map, List } from 'immutable';
import PropTypes from 'prop-types';
import React from 'react';
import { connect } from 'react-redux';

import FormItem from 'console/components/forms/FormItem';
import BooleanIcon from 'console/components/common/BooleanIcon';
import QueryFilteredRecipes from 'console/components/data/QueryFilteredRecipes';
import { getRecipeListingAsRevisionsFlattenedAction } from 'console/state/recipes/selectors';
import { connectFormProps } from 'console/utils/forms';

// Note! Due to a bug (somewhere) the connectFormProps decorator needs to be first!
@connectFormProps
@connect((state, props) => ({
  recipes: getRecipeListingAsRevisionsFlattenedAction(state),
}))
class PreferenceRollbackFields extends React.Component {
  static propTypes = {
    disabled: PropTypes.bool,
    form: PropTypes.object.isRequired,
    recipeArguments: PropTypes.instanceOf(Map),
    recipes: PropTypes.instanceOf(List).isRequired,
  };

  static defaultProps = {
    disabled: false,
    recipeArguments: new Map(),
  };

  render() {
    const { disabled, recipeArguments, recipes } = this.props;
    const filters = {
      action: 'preference-rollout',
    };

    return (
      <div>
        <QueryFilteredRecipes pageNumber={Infinity} filters={filters} />
        <p className="action-info">Roll back a preference rollout.</p>
        <FormItem
          name="arguments.rolloutSlug"
          label="Rollout"
          initialValue={recipeArguments.get('rolloutSlug', '')}
        >
          <Select
            showSearch
            disabled={disabled}
            placeholder="Select corresponding rollout"
            optionFilterProp="children"
            filterOption={(input, option) => {
              return (
                option.props.value.toLowerCase().includes(input.toLowerCase()) ||
                option.props.name.toLowerCase().includes(input.toLowerCase())
              );
            }}
          >
            {recipes.map(recipe => {
              const slug = recipe.getIn(['arguments', 'slug']);
              return (
                <Select.Option value={slug} key={slug} name={recipe.get('name')}>
                  {recipe.get('name')} <small>(slug: {slug})</small>{' '}
                  <BooleanIcon value={recipe.get('enabled')} />
                </Select.Option>
              );
            })}
          </Select>
        </FormItem>
      </div>
    );
  }
}

export default PreferenceRollbackFields;

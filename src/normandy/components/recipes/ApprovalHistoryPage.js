import { List } from 'immutable';
import PropTypes from 'prop-types';
import React from 'react';
import { connect } from 'react-redux';

import LoadingOverlay from 'normandy/components/common/LoadingOverlay';
import QueryRecipe from 'normandy/components/data/QueryRecipe';
import QueryRecipeHistory from 'normandy/components/data/QueryRecipeHistory';
import ApprovalRequest from 'normandy/components/recipes/ApprovalRequest';
import { getRecipeApprovalHistory } from 'normandy/state/app/recipes/selectors';
import { getUrlParamAsInt } from 'normandy/state/router/selectors';

@connect((state, props) => {
  const recipeId = getUrlParamAsInt(props, 'recipeId');

  return {
    history: getRecipeApprovalHistory(state, recipeId),
    recipeId,
  };
})
export default class ApprovalHistoryPage extends React.PureComponent {
  static propTypes = {
    history: PropTypes.instanceOf(List).isRequired,
    recipeId: PropTypes.number.isRequired,
  };

  render() {
    const { history, recipeId } = this.props;

    return (
      <div>
        <QueryRecipe pk={recipeId} />
        <QueryRecipeHistory pk={recipeId} />

        <LoadingOverlay requestIds={`fetch-recipe-history-${recipeId}`}>
          {history.map(revision => (
            <ApprovalRequest key={revision.get('id')} revision={revision} />
          ))}
        </LoadingOverlay>
      </div>
    );
  }
}

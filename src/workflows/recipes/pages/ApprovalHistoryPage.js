import { List } from 'immutable';
import PropTypes from 'prop-types';
import React from 'react';
import { connect } from 'react-redux';

import LoadingOverlay from 'console/components/common/LoadingOverlay';
import QueryRecipe from 'console/components/data/QueryRecipe';
import QueryRecipeHistory from 'console/components/data/QueryRecipeHistory';
import ApprovalRequest from 'console/workflows/recipes/components/ApprovalRequest';
import { getRecipeApprovalHistory } from 'console/state/recipes/selectors';
import { getUrlParamAsInt } from 'console/state/router/selectors';

@connect((state, props) => {
  const recipeId = getUrlParamAsInt(state, 'recipeId');

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
      <div className="content-wrapper">
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

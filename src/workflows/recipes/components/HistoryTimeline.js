import { Timeline } from 'antd';
import autobind from 'autobind-decorator';
import { List } from 'immutable';
import PropTypes from 'prop-types';
import React from 'react';
import { connect } from 'react-redux';

import HistoryItem from 'console/workflows/recipes/components/HistoryItem';

import LoadingOverlay from 'console/components/common/LoadingOverlay';
import QueryRecipeHistory from 'console/components/data/QueryRecipeHistory';
import { getRecipeIdForRevision as getRecipeIdForRevisionSelector } from 'console/state/revisions/selectors';

@connect(state => ({
  getRecipeIdForRevision: id => getRecipeIdForRevisionSelector(state, id),
}))
@autobind
class HistoryTimeline extends React.PureComponent {
  static propTypes = {
    history: PropTypes.instanceOf(List).isRequired,
    recipeId: PropTypes.number.isRequired,
    selectedRevisionId: PropTypes.number.isRequired,
  };

  render() {
    const { history, recipeId, selectedRevisionId } = this.props;

    return (
      <div>
        <QueryRecipeHistory pk={recipeId} />
        <LoadingOverlay requestIds={`fetch-recipe-history-${recipeId}`}>
          <Timeline>
            {history.map((revision, index) => (
              <HistoryItem
                key={revision.get('id')}
                selectedRevisionId={selectedRevisionId}
                revisionNo={history.size - index}
                recipeId={recipeId}
                revision={revision}
              />
            ))}
          </Timeline>
        </LoadingOverlay>
      </div>
    );
  }
}

export default HistoryTimeline;

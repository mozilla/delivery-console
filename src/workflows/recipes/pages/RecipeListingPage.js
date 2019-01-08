import { Pagination, Table } from 'antd';
import autobind from 'autobind-decorator';
import { push } from 'connected-react-router';
import dateFns from 'date-fns';
import { Map, List } from 'immutable';
import PropTypes from 'prop-types';
import React from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';

import BooleanIcon from 'console/components/common/BooleanIcon';
import EnrollmentStatus from 'console/components/common/EnrollmentStatus';
import LoadingOverlay from 'console/components/common/LoadingOverlay';
import QueryFilteredRecipes from 'console/components/data/QueryFilteredRecipes';
import QueryRecipeListingColumns from 'console/components/data/QueryRecipeListingColumns';
import ListingActionBar from 'console/workflows/recipes/components/ListingActionBar';
import DataList from 'console/components/tables/DataList';
import ShieldIdenticon from 'console/components/common/ShieldIdenticon';
import { reverse } from 'console/urls';

import {
  getRecipeListingColumns,
  getRecipeListingCount,
  getRecipeListingFlattenedAction,
} from 'console/state/recipes/selectors';
import {
  getCurrentUrlAsObject as getCurrentUrlAsObjectSelector,
  getQueryParam,
  getQueryParamAsInt,
} from 'console/state/router/selectors';
import { getAllActions } from 'console/state/actions/selectors';

@connect(
  (state, props) => ({
    actions: getAllActions(state, new Map()),
    columns: getRecipeListingColumns(state),
    count: getRecipeListingCount(state),
    getCurrentUrlAsObject: queryParams => getCurrentUrlAsObjectSelector(state, queryParams),
    ordering: getQueryParam(state, 'ordering', '-last_updated'),
    pageNumber: getQueryParamAsInt(state, 'page', 1),
    recipes: getRecipeListingFlattenedAction(state),
    searchText: getQueryParam(state, 'searchText'),
    status: getQueryParam(state, 'status'),
    action: getQueryParam(state, 'action'),
  }),
  {
    push,
  },
)
@autobind
class RecipeListingPage extends React.PureComponent {
  static propTypes = {
    actions: PropTypes.instanceOf(Map).isRequired,
    columns: PropTypes.instanceOf(List).isRequired,
    count: PropTypes.number,
    getCurrentUrlAsObject: PropTypes.func.isRequired,
    ordering: PropTypes.string,
    pageNumber: PropTypes.number,
    push: PropTypes.func.isRequired,
    recipes: PropTypes.instanceOf(List).isRequired,
    searchText: PropTypes.string,
    status: PropTypes.string,
    action: PropTypes.string,
  };

  static defaultProps = {
    count: null,
    ordering: null,
    pageNumber: null,
    searchText: null,
    status: null,
    action: null,
  };

  static renderLinkedText(text, { id: recipeId }) {
    return <Link to={reverse('recipes.details', { recipeId })}>{text}</Link>;
  }

  getFilters() {
    const { ordering, searchText, status, action } = this.props;

    const filters = {
      text: searchText,
      ordering,
      status,
      action,
    };

    Object.keys(filters).forEach(key => {
      if ([undefined, null].includes(filters[key])) {
        delete filters[key];
      }
    });

    return filters;
  }

  handleChangePage(page) {
    const { getCurrentUrlAsObject } = this.props;
    this.props.push(getCurrentUrlAsObject({ page }));
  }

  getUrlFromRecord({ id: recipeId }) {
    return reverse('recipes.details', { recipeId });
  }

  render() {
    const { columns, count, ordering, pageNumber, recipes, status, action, actions } = this.props;
    const actionNames = Object.values(actions.toJS()).map(action => action.name);
    actionNames.sort();

    const filters = this.getFilters();

    const filterIds = Object.keys(filters).map(key => `${key}-${filters[key]}`);
    const requestId = `fetch-filtered-recipes-page-${pageNumber}-${filterIds.join('-')}`;

    const columnRenderers = {
      name: ({ ordering }) => {
        return (
          <Table.Column
            title="Name"
            dataIndex="name"
            key="name"
            render={(text, record) => (
              <div className="recipe-listing-name">
                <ShieldIdenticon className="shieldicon" seed={record.identicon_seed} size={24} />
                {RecipeListingPage.renderLinkedText(text, record)}
              </div>
            )}
            sortOrder={DataList.getSortOrder('name', ordering)}
            sorter
          />
        );
      },

      action: ({ action, ordering }) => {
        // If 'action' is null, don't set the filteredValue prop to: [null]
        // or else it will always appear highlit.
        const filteredValue = [];
        if (action) {
          filteredValue.push(action);
        }
        return (
          <Table.Column
            title="Action"
            dataIndex="action"
            key="action"
            render={RecipeListingPage.renderLinkedText}
            filters={actionNames.map(name => ({ text: name, value: name }))}
            filteredValue={filteredValue}
            filterMultiple={false}
            sortOrder={DataList.getSortOrder('action', ordering)}
            sorter
          />
        );
      },

      enabled: ({ status }) => {
        // If 'status' is null, don't set the filteredValue prop to: [null]
        // or else it will always appear highlit.
        const filteredValue = [];
        if (status) {
          filteredValue.push(status);
        }
        return (
          <Table.Column
            title="Enabled"
            key="status"
            render={(text, record) => <BooleanIcon value={record.enabled} />}
            filters={[
              { text: 'Enabled', value: 'enabled' },
              { text: 'Disabled', value: 'disabled' },
            ]}
            filteredValue={filteredValue}
            filterMultiple={false}
          />
        );
      },

      paused: () => {
        return (
          <Table.Column
            title="Enrollment Active"
            key="paused"
            render={(text, record) => <EnrollmentStatus recipe={record} />}
          />
        );
      },

      lastUpdated: ({ ordering }) => {
        return (
          <Table.Column
            title="Last Updated"
            key="last_updated"
            dataIndex="last_updated"
            render={(text, record) => {
              const lastUpdated = dateFns.parse(record.last_updated);
              return (
                <Link
                  to={reverse('recipes.details', { recipeId: record.id })}
                  title={dateFns.format(lastUpdated, 'dddd, MMMM M, YYYY h:mm A')}
                >
                  {dateFns.distanceInWordsToNow(lastUpdated)}
                </Link>
              );
            }}
            sortOrder={DataList.getSortOrder('last_updated', ordering)}
            sorter
          />
        );
      },
    };

    return (
      <div className="content-wrapper">
        <QueryRecipeListingColumns />
        <QueryFilteredRecipes pageNumber={pageNumber} filters={filters} />

        <ListingActionBar />

        <LoadingOverlay requestIds={requestId}>
          <DataList
            columns={columns}
            columnRenderers={columnRenderers}
            dataSource={recipes.toJS()}
            ordering={ordering}
            defaultOrdering={ordering === '-last_updated' ? 'last_updated' : '-last_updated'}
            getUrlFromRecord={this.getUrlFromRecord}
            status={status}
            action={action}
          />
        </LoadingOverlay>

        <Pagination
          current={pageNumber}
          pageSize={10}
          total={count}
          onChange={this.handleChangePage}
        />
      </div>
    );
  }
}

export default RecipeListingPage;

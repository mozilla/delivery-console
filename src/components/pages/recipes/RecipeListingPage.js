import { Pagination, Table } from 'antd';
import autobind from 'autobind-decorator';
import { List } from 'immutable';
import moment from 'moment';
import PropTypes from 'prop-types';
import React from 'react';
import { connect } from 'react-redux';
import { withRouter } from 'react-router';
import { NavLink } from 'react-router-dom';

import BooleanIcon from 'console/components/common/BooleanIcon';
import EnrollmentStatus from 'console/components/common/EnrollmentStatus';
import LoadingOverlay from 'console/components/common/LoadingOverlay';
import QueryFilteredRecipes from 'console/components/data/QueryFilteredRecipes';
import QueryRecipeListingColumns from 'console/components/data/QueryRecipeListingColumns';
import ListingActionBar from 'console/components/recipes/ListingActionBar';
import DataList from 'console/components/tables/DataList';
import ShieldIdenticon from 'console/components/common/ShieldIdenticon';

import { fetchFilteredRecipesPage as fetchFilteredRecipesPageAction } from 'console/state/recipes/actions';
import {
  getRecipeListingColumns,
  getRecipeListingCount,
  getRecipeListingFlattenedAction,
} from 'console/state/recipes/selectors';
import {
  getCurrentURL as getCurrentURLSelector,
  getQueryParam,
  getQueryParamAsInt,
} from 'console/state/router/selectors';

@withRouter
@connect(
  (state, props) => ({
    columns: getRecipeListingColumns(state),
    count: getRecipeListingCount(state),
    getCurrentURL: queryParams => getCurrentURLSelector(state, queryParams),
    ordering: getQueryParam(props, 'ordering', '-last_updated'),
    pageNumber: getQueryParamAsInt(props, 'page', 1),
    recipes: getRecipeListingFlattenedAction(state),
    searchText: getQueryParam(props, 'searchText'),
    status: getQueryParam(props, 'status'),
  }),
  {
    fetchFilteredRecipesPage: fetchFilteredRecipesPageAction,
    openNewWindow: window.open,
  },
)
@autobind
export default class RecipeListingPage extends React.PureComponent {
  static propTypes = {
    columns: PropTypes.instanceOf(List).isRequired,
    count: PropTypes.number,
    fetchFilteredRecipesPage: PropTypes.func.isRequired,
    getCurrentURL: PropTypes.func.isRequired,
    openNewWindow: PropTypes.func.isRequired,
    ordering: PropTypes.string,
    pageNumber: PropTypes.number,
    history: PropTypes.object.isRequired,
    recipes: PropTypes.instanceOf(List).isRequired,
    searchText: PropTypes.string,
    status: PropTypes.string,
  };

  static defaultProps = {
    count: null,
    ordering: null,
    pageNumber: null,
    searchText: null,
    status: null,
  };

  static columnRenderers = {
    name({ ordering }) {
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

    action() {
      return (
        <Table.Column
          title="Action"
          dataIndex="action"
          key="action"
          render={RecipeListingPage.renderLinkedText}
        />
      );
    },

    enabled({ status }) {
      return (
        <Table.Column
          title="Enabled"
          key="status"
          render={(text, record) => <BooleanIcon value={record.enabled} />}
          filters={[
            { text: 'Enabled', value: 'enabled' },
            { text: 'Disabled', value: 'disabled' },
          ]}
          filteredValue={status}
          filterMultiple={false}
        />
      );
    },

    paused() {
      return (
        <Table.Column
          title="Enrollment Active"
          key="paused"
          render={(text, record) => <EnrollmentStatus recipe={record} />}
        />
      );
    },

    lastUpdated({ ordering }) {
      return (
        <Table.Column
          title="Last Updated"
          key="last_updated"
          dataIndex="last_updated"
          render={(text, record) => {
            const lastUpdated = moment(record.last_updated);
            return (
              <NavLink to={`/recipe/${record.id}/`} title={lastUpdated.format('LLLL')}>
                {lastUpdated.fromNow()}
              </NavLink>
            );
          }}
          sortOrder={DataList.getSortOrder('last_updated', ordering)}
          sorter
        />
      );
    },
  };

  static renderLinkedText(text, record) {
    return <NavLink to={`/recipe/${record.id}/`}>{text}</NavLink>;
  }

  getFilters() {
    const { ordering, searchText, status } = this.props;

    const filters = {
      text: searchText,
      ordering,
      status,
    };

    Object.keys(filters).forEach(key => {
      if ([undefined, null].includes(filters[key])) {
        delete filters[key];
      }
    });

    return filters;
  }

  handleChangePage(page) {
    const { getCurrentURL, history } = this.props;
    history.push(getCurrentURL({ page }));
  }

  handleRowClick(record, index, event) {
    // If the user has clicked a link directly, just fall back to the native event.
    if (event.target.tagName === 'A') {
      return;
    }

    // If we're here, the user clicked the row itself, which now needs to behave
    // as if it was a native link click. This includes opening a new tab if using
    // a modifier key (like ctrl).

    let navTo = this.props.history.push.bind(this.props.history);

    // No link but the user requested a new window.
    if (event.ctrlKey || event.metaKey || event.button === 1) {
      navTo = this.props.openNewWindow;
    }

    navTo(`/recipe/${record.id}/`);
  }

  render() {
    const { columns, count, ordering, pageNumber, recipes, status } = this.props;

    const filters = this.getFilters();

    const filterIds = Object.keys(filters).map(key => `${key}-${filters[key]}`);
    const requestId = `fetch-filtered-recipes-page-${pageNumber}-${filterIds.join('-')}`;
    return (
      <div>
        <QueryRecipeListingColumns />
        <QueryFilteredRecipes pageNumber={pageNumber} filters={filters} />

        <ListingActionBar />

        <LoadingOverlay requestIds={requestId}>
          <DataList
            columns={columns}
            columnRenderers={RecipeListingPage.columnRenderers}
            dataSource={recipes.toJS()}
            ordering={ordering}
            onRowClick={this.handleRowClick}
            status={status}
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

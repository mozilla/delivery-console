import { Pagination, Table } from 'antd';
import autobind from 'autobind-decorator';
import { List } from 'immutable';
import PropTypes from 'prop-types';
import React from 'react';
import { connect } from 'react-redux';
import { withRouter } from 'react-router';
import { NavLink } from 'react-router-dom';

import LoadingOverlay from 'console/components/common/LoadingOverlay';
import QueryExtensionListingColumns from 'console/components/data/QueryExtensionListingColumns';
import QueryMultipleExtensions from 'console/components/data/QueryMultipleExtensions';
import ListingActionBar from 'console/components/extensions/ListingActionBar';
import DataList from 'console/components/tables/DataList';
import {
  getExtensionListingColumns,
  getExtensionListingCount,
  getExtensionListing,
} from 'console/state/extensions/selectors';
import {
  getCurrentUrl as getCurrentUrlSelector,
  getQueryParam,
  getQueryParamAsInt,
} from 'console/state/router/selectors';

@withRouter
@connect(
  (state, props) => ({
    columns: getExtensionListingColumns(state),
    count: getExtensionListingCount(state),
    extensions: getExtensionListing(state),
    getCurrentUrl: queryParams => getCurrentUrlSelector(state, queryParams),
    ordering: getQueryParam(state, 'ordering', '-last_updated'),
    pageNumber: getQueryParamAsInt(state, 'page', 1),
  }),
  {},
)
@autobind
export default class ExtensionListingPage extends React.PureComponent {
  static propTypes = {
    columns: PropTypes.instanceOf(List).isRequired,
    count: PropTypes.number,
    extensions: PropTypes.instanceOf(List).isRequired,
    getCurrentUrl: PropTypes.func.isRequired,
    ordering: PropTypes.string,
    pageNumber: PropTypes.number,
    history: PropTypes.object.isRequired,
  };

  static defaultProps = {
    count: null,
    ordering: null,
    pageNumber: null,
    searchText: null,
    status: null,
  };

  static columnRenderers = {
    name() {
      return (
        <Table.Column
          title="Name"
          dataIndex="name"
          key="name"
          render={ExtensionListingPage.renderLinkedText}
        />
      );
    },

    xpi() {
      return (
        <Table.Column
          title="XPI URL"
          dataIndex="xpi"
          key="xpi"
          render={ExtensionListingPage.renderLinkedText}
        />
      );
    },
  };

  static renderLinkedText(text, record) {
    return <NavLink to={`/extension/${record.id}/`}>{text}</NavLink>;
  }

  getFilters() {
    const { ordering } = this.props;

    const filters = {
      ordering,
    };

    Object.keys(filters).forEach(key => {
      if ([undefined, null].includes(filters[key])) {
        delete filters[key];
      }
    });

    return filters;
  }

  handleChangePage(page) {
    const { getCurrentUrl, history } = this.props;
    history.push(getCurrentUrl({ page }));
  }

  handleRowClick(record) {
    this.props.history.push(`/extension/${record.id}/`);
  }

  render() {
    const { columns, count, extensions, ordering, pageNumber } = this.props;

    return (
      <div className="content-wrapper">
        <QueryExtensionListingColumns />
        <QueryMultipleExtensions pageNumber={pageNumber} />

        <ListingActionBar />

        <LoadingOverlay requestIds={`fetch-extensions-page-${pageNumber}`}>
          <DataList
            columns={columns}
            columnRenderers={ExtensionListingPage.columnRenderers}
            dataSource={extensions.toJS()}
            ordering={ordering}
            onRowClick={this.handleRowClick}
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

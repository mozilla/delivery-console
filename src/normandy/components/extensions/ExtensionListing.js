import { Pagination, Table } from 'antd';
import autobind from 'autobind-decorator';
import { List } from 'immutable';
import PropTypes from 'prop-types';
import React from 'react';
import { connect } from 'react-redux';
import { withRouter } from 'react-router';
import { NormandyLink as Link } from 'normandy/Router';

import LoadingOverlay from 'normandy/components/common/LoadingOverlay';
import QueryExtensionListingColumns from 'normandy/components/data/QueryExtensionListingColumns';
import QueryMultipleExtensions from 'normandy/components/data/QueryMultipleExtensions';
import ListingActionBar from 'normandy/components/extensions/ListingActionBar';
import DataList from 'normandy/components/tables/DataList';
import {
  getExtensionListingColumns,
  getExtensionListingCount,
  getExtensionListing,
} from 'normandy/state/app/extensions/selectors';
import {
  getCurrentURL as getCurrentURLSelector,
  getQueryParam,
  getQueryParamAsInt,
} from 'normandy/state/router/selectors';
import { NormandyLink } from '../../Router';


@withRouter
@connect(
  (state, props) => ({
    columns: getExtensionListingColumns(state),
    count: getExtensionListingCount(state),
    extensions: getExtensionListing(state),
    getCurrentURL: queryParams => getCurrentURLSelector(state, queryParams),
    ordering: getQueryParam(props, 'ordering', '-last_updated'),
    pageNumber: getQueryParamAsInt(props, 'page', 1),
  }),
  {},
)
@autobind
export default class ExtensionListing extends React.PureComponent {
  static propTypes = {
    columns: PropTypes.instanceOf(List).isRequired,
    count: PropTypes.number,
    extensions: PropTypes.instanceOf(List).isRequired,
    getCurrentURL: PropTypes.func.isRequired,
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
  }

  static columnRenderers = {
    name() {
      return (
        <Table.Column
          title="Name"
          dataIndex="name"
          key="name"
          render={ExtensionListing.renderLinkedText}
        />
      );
    },

    xpi() {
      return (
        <Table.Column
          title="XPI URL"
          dataIndex="xpi"
          key="xpi"
          render={ExtensionListing.renderLinkedText}
        />
      );
    },
  }

  static renderLinkedText(text, record) {
    return <Link to={`/extension/${record.id}/`}>{text}</Link>;
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
    const { getCurrentURL, history } = this.props;
    history.push(getCurrentURL({ page }));
  }

  handleRowClick(record) {
    this.props.history.push(`${NormandyLink.PREFIX}/extension/${record.id}/`);
  }

  render() {
    const { columns, count, extensions, ordering, pageNumber } = this.props;

    return (
      <div>
        <QueryExtensionListingColumns />
        <QueryMultipleExtensions pageNumber={pageNumber} />

        <ListingActionBar />

        <LoadingOverlay requestIds={`fetch-extensions-page-${pageNumber}`}>
          <DataList
            columns={columns}
            columnRenderers={ExtensionListing.columnRenderers}
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

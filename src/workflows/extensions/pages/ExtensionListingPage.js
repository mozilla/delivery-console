import { Pagination, Table } from 'antd';
import autobind from 'autobind-decorator';
import { push } from 'connected-react-router';
import { List } from 'immutable';
import PropTypes from 'prop-types';
import React from 'react';
import { connect } from 'react-redux';
import { NavLink } from 'react-router-dom';

import LoadingOverlay from 'console/components/common/LoadingOverlay';
import QueryExtensionListingColumns from 'console/components/data/QueryExtensionListingColumns';
import QueryMultipleExtensions from 'console/components/data/QueryMultipleExtensions';
import ListingActionBar from 'console/workflows/extensions/components/ListingActionBar';
import DataList from 'console/components/tables/DataList';
import {
  getExtensionListingColumns,
  getExtensionListingCount,
  getExtensionListing,
} from 'console/state/extensions/selectors';
import {
  getCurrentUrlAsObject as getCurrentUrlAsObjectSelector,
  getQueryParam,
  getQueryParamAsInt,
} from 'console/state/router/selectors';
import { reverse } from 'console/urls';

@connect(
  (state, props) => ({
    columns: getExtensionListingColumns(state),
    count: getExtensionListingCount(state),
    extensions: getExtensionListing(state),
    getCurrentUrlAsObject: queryParams => getCurrentUrlAsObjectSelector(state, queryParams),
    ordering: getQueryParam(state, 'ordering', '-last_updated'),
    pageNumber: getQueryParamAsInt(state, 'page', 1),
  }),
  {
    push,
  },
)
@autobind
class ExtensionListingPage extends React.PureComponent {
  static propTypes = {
    columns: PropTypes.instanceOf(List).isRequired,
    count: PropTypes.number,
    extensions: PropTypes.instanceOf(List).isRequired,
    getCurrentUrlAsObject: PropTypes.func.isRequired,
    ordering: PropTypes.string,
    pageNumber: PropTypes.number,
    push: PropTypes.func.isRequired,
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

  static renderLinkedText(text, { id: extensionId }) {
    return <NavLink to={reverse('extensions.edit', { extensionId })}>{text}</NavLink>;
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
    const { getCurrentUrlAsObject } = this.props;
    this.props.push(getCurrentUrlAsObject({ page }));
  }

  getUrlFromRecord({ id: extensionId }) {
    return reverse('extensions.edit', { extensionId });
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
            getUrlFromRecord={this.getUrlFromRecord}
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

export default ExtensionListingPage;

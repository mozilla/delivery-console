import { Table } from 'antd';
import autobind from 'autobind-decorator';
import { push } from 'connected-react-router';
import { List } from 'immutable';
import PropTypes from 'prop-types';
import React from 'react';
import { connect } from 'react-redux';

import { openNewWindow } from 'console/state/router/actions';
import { getCurrentUrlAsObject as getCurrentUrlAsObjectSelector } from 'console/state/router/selectors';

@connect(
  state => ({
    getCurrentUrlAsObject: queryParams => getCurrentUrlAsObjectSelector(state, queryParams),
  }),
  {
    openNewWindow,
    push,
  },
)
@autobind
class DataList extends React.PureComponent {
  static propTypes = {
    columnRenderers: PropTypes.object.isRequired,
    columns: PropTypes.instanceOf(List).isRequired,
    dataSource: PropTypes.array.isRequired,
    getCurrentUrlAsObject: PropTypes.func.isRequired,
    openNewWindow: PropTypes.func.isRequired,
    ordering: PropTypes.string,
    getUrlFromRecord: PropTypes.func.isRequired,
    push: PropTypes.func.isRequired,
  };

  static defaultProps = {
    ordering: null,
  };

  static getSortOrder = (field, ordering) => {
    if (ordering && ordering.endsWith(field)) {
      return ordering.startsWith('-') ? 'descend' : 'ascend';
    }
    return false;
  };

  handleRowClick(record, index, event) {
    // If the user has clicked a link directly, just fall back to the native event.
    if (event.target.tagName === 'A') {
      return;
    }

    // If we're here, the user clicked the row itself, which now needs to behave
    // as if it was a native link click. This includes opening a new tab if using
    // a modifier key (like ctrl).
    let navTo = this.props.push;

    // No link but the user requested a new window.
    if (event.ctrlKey || event.metaKey || event.button === 1) {
      navTo = this.props.openNewWindow;
    }

    navTo(this.props.getUrlFromRecord(record));
  }

  handleChangeSortFilters(pagination, filters, sorter) {
    const { getCurrentUrlAsObject } = this.props;
    const filterParams = Object.entries(filters)
      .filter(([key, value]) => value)
      .reduce((obj, [key, value]) => {
        const normalized = value.join ? value.join(',') : value;
        obj[key] = normalized || null;
        return obj;
      }, {});

    let ordering;
    if (Object.keys(sorter).length) {
      const prefix = sorter.order === 'ascend' ? '' : '-';
      ordering = `${prefix}${sorter.field}`;
    }

    this.props.push(
      getCurrentUrlAsObject({
        page: null, // Return to the first page
        ordering,
        ...filterParams,
      }),
    );
  }

  render() {
    const { columnRenderers, columns, dataSource } = this.props;

    const onRow = (record, index) => ({
      onClick: this.handleRowClick.bind(this, record, index),
    });

    return (
      <Table
        className="list"
        dataSource={dataSource}
        pagination={false}
        rowKey="id"
        onChange={this.handleChangeSortFilters}
        onRow={onRow}
        bordered
      >
        {columns.map(column => columnRenderers[column](this.props))}
      </Table>
    );
  }
}

export default DataList;

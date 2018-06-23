import { Table } from 'antd';
import autobind from 'autobind-decorator';
import { push } from 'connected-react-router';
import { List } from 'immutable';
import PropTypes from 'prop-types';
import React from 'react';
import { connect } from 'react-redux';
import { isEmpty } from 'lodash';

import { getCurrentUrl as getCurrentUrlSelector } from 'console/state/router/selectors';

@connect(
  state => ({
    getCurrentUrl: queryParams => getCurrentUrlSelector(state, queryParams),
  }),
  {
    push,
  },
)
@autobind
export default class DataList extends React.PureComponent {
  static propTypes = {
    columnRenderers: PropTypes.object.isRequired,
    columns: PropTypes.instanceOf(List).isRequired,
    dataSource: PropTypes.array.isRequired,
    getCurrentUrl: PropTypes.func.isRequired,
    ordering: PropTypes.string,
    onRowClick: PropTypes.func,
    push: PropTypes.func.isRequired,
  };

  static defaultProps = {
    ordering: null,
    onRowClick: null,
  };

  static getSortOrder = (field, ordering) => {
    if (ordering && ordering.endsWith(field)) {
      return ordering.startsWith('-') ? 'descend' : 'ascend';
    }
    return false;
  };

  handleChangeSortFilters(pagination, filters, sorter) {
    const { getCurrentUrl } = this.props;
    const filterParams = {};
    Object.entries(filters).forEach(([key, values]) => {
      filterParams[key] = values && values.join(',');
    });

    let ordering;
    if (!isEmpty(sorter)) {
      const prefix = sorter.order === 'ascend' ? '' : '-';
      ordering = `${prefix}${sorter.field}`;
    }

    this.props.push(
      getCurrentUrl({
        page: undefined, // Return to the first page
        ordering,
        ...filterParams,
      }),
    );
  }

  render() {
    const { columnRenderers, columns, dataSource, onRowClick } = this.props;

    const onRow = (record, index) => ({
      onClick: onRowClick.bind(null, record, index),
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

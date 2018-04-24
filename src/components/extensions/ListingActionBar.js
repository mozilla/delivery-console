import { Button, Col, Row } from 'antd';
import autobind from 'autobind-decorator';
import { List } from 'immutable';
import PropTypes from 'prop-types';
import React from 'react';
import { connect } from 'react-redux';
import { withRouter } from 'react-router';
import { NavLink } from 'react-router-dom';

import CheckboxMenu from 'console/components/common/CheckboxMenu';
import { saveExtensionListingColumns as saveExtensionListingColumnsAction } from 'console/state/extensions/actions';
import { getExtensionListingColumns } from 'console/state/extensions/selectors';
import { getCurrentURL as getCurrentURLSelector } from 'console/state/router/selectors';

@withRouter
@connect(
  state => ({
    columns: getExtensionListingColumns(state),
    getCurrentURL: queryParams => getCurrentURLSelector(state, queryParams),
  }),
  {
    saveExtensionListingColumns: saveExtensionListingColumnsAction,
  },
)
@autobind
export default class ListingActionBar extends React.PureComponent {
  static propTypes = {
    columns: PropTypes.instanceOf(List).isRequired,
    getCurrentURL: PropTypes.func.isRequired,
    history: PropTypes.object.isRequired,
    saveExtensionListingColumns: PropTypes.func.isRequired,
  };

  handleChangeSearch(value) {
    const { getCurrentURL, history } = this.props;
    history.push(getCurrentURL({ searchText: value || undefined }));
  }

  render() {
    const { columns, saveExtensionListingColumns } = this.props;
    return (
      <Row gutter={16} className="list-action-bar">
        <Col span={16}>
          <CheckboxMenu
            checkboxes={columns.toJS()}
            label="Columns"
            onChange={saveExtensionListingColumns}
            options={[
              { label: 'Name', value: 'name' },
              { label: 'XPI URL', value: 'xpi' },
            ]}
          />
        </Col>
        <Col span={8} className="righted">
          <NavLink to="/extension/new/">
            <Button type="primary" icon="plus">
              New Extension
            </Button>
          </NavLink>
        </Col>
      </Row>
    );
  }
}

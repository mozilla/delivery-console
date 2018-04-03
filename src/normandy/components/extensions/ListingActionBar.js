import { Button, Col, Row } from 'antd';
import autobind from 'autobind-decorator';
import { List } from 'immutable';
import PropTypes from 'prop-types';
import React from 'react';
import { connect } from 'react-redux';
import { withRouter } from 'react-router';
import { NormandyLink as Link } from 'normandy/Router';

import CheckboxMenu from 'normandy/components/common/CheckboxMenu';
import { saveExtensionListingColumns as saveExtensionListingColumnsAction } from 'normandy/state/app/extensions/actions';
import { getExtensionListingColumns } from 'normandy/state/app/extensions/selectors';
import { getCurrentURL as getCurrentURLSelector } from 'normandy/state/router/selectors';

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
          <Link to="/extension/new/">
            <Button type="primary" icon="plus">
              New Extension
            </Button>
          </Link>
        </Col>
      </Row>
    );
  }
}

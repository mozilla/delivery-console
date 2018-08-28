import { Button, Col, Row } from 'antd';
import autobind from 'autobind-decorator';
import { push } from 'connected-react-router';
import { List } from 'immutable';
import PropTypes from 'prop-types';
import React from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';

import CheckboxMenu from 'console/components/common/CheckboxMenu';
import { saveExtensionListingColumns } from 'console/state/extensions/actions';
import { getExtensionListingColumns } from 'console/state/extensions/selectors';
import { getCurrentUrlAsObject as getCurrentUrlAsObjectSelector } from 'console/state/router/selectors';
import { reverse } from 'console/urls';

@connect(
  state => ({
    columns: getExtensionListingColumns(state),
    getCurrentUrlAsObject: queryParams => getCurrentUrlAsObjectSelector(state, queryParams),
  }),
  {
    push,
    saveExtensionListingColumns,
  },
)
@autobind
class ListingActionBar extends React.PureComponent {
  static propTypes = {
    columns: PropTypes.instanceOf(List).isRequired,
    getCurrentUrlAsObject: PropTypes.func.isRequired,
    saveExtensionListingColumns: PropTypes.func.isRequired,
  };

  handleChangeSearch(value) {
    const { getCurrentUrlAsObject } = this.props;
    this.props.push(getCurrentUrlAsObject({ searchText: value || undefined }));
  }

  render() {
    const { columns } = this.props;
    return (
      <Row gutter={16} className="list-action-bar">
        <Col span={16}>
          <CheckboxMenu
            checkboxes={columns.toJS()}
            label="Columns"
            onChange={this.props.saveExtensionListingColumns}
            options={[{ label: 'Name', value: 'name' }, { label: 'XPI URL', value: 'xpi' }]}
          />
        </Col>
        <Col span={8} className="righted">
          <Link to={reverse('extensions.new')}>
            <Button type="primary" icon="plus">
              New Extension
            </Button>
          </Link>
        </Col>
      </Row>
    );
  }
}

export default ListingActionBar;

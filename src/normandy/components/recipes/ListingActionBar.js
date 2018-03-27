import { Button, Col, Input, Row } from 'antd';
import autobind from 'autobind-decorator';
import { List } from 'immutable';
import PropTypes from 'prop-types';
import React from 'react';
import { connect } from 'react-redux';
import { withRouter } from 'react-router';
import { NormandyLink as Link } from 'normandy/Router';

import CheckboxMenu from 'normandy/components/common/CheckboxMenu';
import {
  saveRecipeListingColumns as saveRecipeListingColumnsAction,
} from 'normandy/state/app/recipes/actions';
import {
  getRecipeListingColumns,
} from 'normandy/state/app/recipes/selectors';
import {
  getCurrentURL as getCurrentURLSelector,
  getQueryParam,
} from 'normandy/state/router/selectors';

@withRouter
@connect(
  (state, props) => ({
    columns: getRecipeListingColumns(state),
    getCurrentURL: queryParams => getCurrentURLSelector(state, queryParams),
    searchText: getQueryParam(props, 'searchText'),
  }),
  {
    saveRecipeListingColumns: saveRecipeListingColumnsAction,
  },
)
@autobind
export default class ListingActionBar extends React.PureComponent {
  static propTypes = {
    columns: PropTypes.instanceOf(List).isRequired,
    getCurrentURL: PropTypes.func.isRequired,
    history: PropTypes.object.isRequired,
    saveRecipeListingColumns: PropTypes.func.isRequired,
    searchText: PropTypes.string,
  };

  static defaultProps = {
    searchText: null,
  }

  handleChangeSearch(value) {
    const { getCurrentURL, history } = this.props;
    history.push(getCurrentURL({ searchText: value || undefined }));
  }

  render() {
    const { columns, searchText } = this.props;
    return (
      <Row gutter={16} className="list-action-bar">
        <Col span={14}>
          <Input.Search
            className="search"
            placeholder="Search..."
            defaultValue={searchText}
            onSearch={this.handleChangeSearch}
          />
        </Col>
        <Col span={2}>
          <CheckboxMenu
            checkboxes={columns.toJS()}
            label="Columns"
            onChange={this.props.saveRecipeListingColumns}
            options={[
              { label: 'Name', value: 'name' },
              { label: 'Action', value: 'action' },
              { label: 'Enabled', value: 'enabled' },
              { label: 'Last Updated', value: 'lastUpdated' },
              { label: 'Enrollment Active', value: 'paused' },
            ]}
          />
        </Col>
        <Col span={8} className="righted">
          <Link to="/recipe/new/" id="lab-recipe-link">
            <Button type="primary" icon="plus" id="lab-recipe-button">New Recipe</Button>
          </Link>
        </Col>
      </Row>
    );
  }
}

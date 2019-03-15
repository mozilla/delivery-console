import { Icon, Select, Spin } from 'antd';
import autobind from 'autobind-decorator';
import { List } from 'immutable';
import PropTypes from 'prop-types';
import React from 'react';
import { connect } from 'react-redux';

import QueryMultipleExtensions from 'console/components/data/QueryMultipleExtensions';
import { getExtensionListing } from 'console/state/extensions/selectors';
import { isRequestInProgress } from 'console/state/network/selectors';

const { OptGroup, Option } = Select;

@connect(state => ({
  extensions: getExtensionListing(state),
  // For search results, we can assume that we'll always be loading just the
  // first page, so this request ID is a constant.
  isLoadingSearch: isRequestInProgress(state, 'fetch-extensions-page-1'),
}))
@autobind
class ExtensionSelect extends React.Component {
  static propTypes = {
    disabled: PropTypes.bool,
    extensions: PropTypes.instanceOf(List).isRequired,
    isLoadingSearch: PropTypes.bool.isRequired,
    onChange: PropTypes.func,
    size: PropTypes.oneOf(['small', 'large']),
    value: PropTypes.any,
  };

  static defaultProps = {
    disabled: false,
    onChange: null,
    size: 'default',
    value: null,
  };

  // Define the commonly-used elements on the class, so they're compiled only once.
  static placeholderElement = (
    <span>
      <Icon type="search" />
      {' Search Extensions'}
    </span>
  );
  static noOptionsDisplay = <span>No extensions found!</span>;
  static loadingDisplay = <Spin size="small" />;

  state = {
    search: null,
  };

  updateSearch(search) {
    if (this.searchDebounce) {
      clearTimeout(this.searchDebounce);
    }
    this.searchDebounce = setTimeout(() => {
      this.setState({
        search,
      });
    }, 200);
  }

  render() {
    const { search } = this.state;
    let displayedList = this.props.extensions;
    const queryFilters = search ? { text: search } : {};

    const { placeholderElement, loadingDisplay, noOptionsDisplay } = ExtensionSelect;

    const { isLoadingSearch, disabled, onChange, size, value } = this.props;
    const optGroupLabel = search ? 'Search results' : 'Recently uploaded extensions';

    if (isLoadingSearch) {
      displayedList = new List();
    }

    return (
      <div>
        <QueryMultipleExtensions filters={queryFilters} pageNumber={1} />
        <Select
          value={value || undefined}
          disabled={disabled}
          onChange={onChange}
          size={size}
          filterOption={false}
          placeholder={placeholderElement}
          notFoundContent={isLoadingSearch ? loadingDisplay : noOptionsDisplay}
          onSearch={this.updateSearch}
          showSearch
        >
          <OptGroup label={optGroupLabel}>
            {displayedList.map(item => {
              const id = item.get('id');
              const name = item.get('name');
              const xpi = item.get('xpi');

              return (
                <Option key={id} value={id} title={name} url={xpi}>
                  {name}
                </Option>
              );
            })}
          </OptGroup>
        </Select>
      </div>
    );
  }
}

export default ExtensionSelect;

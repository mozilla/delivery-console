import { Button, Popover, Icon } from 'antd';
import { fromJS, List } from 'immutable';
import autobind from 'autobind-decorator';
import React from 'react';
import PropTypes from 'prop-types';

import ShieldIdenticon from 'console/components/common/ShieldIdenticon';

@autobind
class IdenticonField extends React.PureComponent {
  static propTypes = {
    disabled: PropTypes.bool,
    onChange: PropTypes.func,
    value: PropTypes.any,
  };

  static defaultProps = {
    disabled: false,
  };

  static generateSeed() {
    return `v1:${Math.random()
      .toString(36)
      .substr(2)}`;
  }

  constructor(props) {
    super(props);

    this.state = {
      history: props.value ? fromJS([props.value]) : new List(),
      index: props.value ? 0 : -1,
    };
  }

  componentDidUpdate(prevProps) {
    const { value } = this.props;
    if (value && value !== prevProps.value) {
      this.setState(({ history, index }) => {
        const newIndex = history.includes(value) ? history.indexOf(value) : history.size;
        const newHistory = newIndex === history.size ? history.push(value) : history;

        return {
          index: newIndex,
          history: newHistory,
        };
      });
    }
  }

  navigateHistory(step) {
    const { onChange } = this.props;
    const { index, history } = this.state;
    const newIndex = index + step;
    let next;

    if (newIndex >= 0) {
      next = history.get(newIndex, IdenticonField.generateSeed());

      if (onChange) {
        onChange(next);
      }
    }
  }

  handlePrev() {
    this.navigateHistory(-1);
  }

  handleNext() {
    this.navigateHistory(1);
  }

  renderIdenticon() {
    const { value } = this.props;

    if (!value) {
      return null;
    }

    return (
      <Popover
        mouseEnterDelay={0.75}
        content={<ShieldIdenticon seed={value} size={256} />}
        placement="right"
      >
        <div className="shield-container">
          <ShieldIdenticon seed={value} />
        </div>
      </Popover>
    );
  }

  render() {
    return (
      <div className="identicon-field">
        <Button
          className="btn-prev"
          size="small"
          type="primary"
          disabled={this.props.disabled || this.state.index <= 0}
          onClick={this.handlePrev}
        >
          <Icon type="left" />
        </Button>

        {this.renderIdenticon()}

        <Button
          className="btn-next"
          size="small"
          type="primary"
          disabled={this.props.disabled}
          onClick={this.handleNext}
        >
          <Icon type="right" />
        </Button>
      </div>
    );
  }
}

export default IdenticonField;

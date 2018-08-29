import { Button } from 'antd';
import { push } from 'connected-react-router';
import PropTypes from 'prop-types';
import React from 'react';
import { connect } from 'react-redux';

import { openNewWindow } from 'console/state/router/actions';

@connect(
  null,
  {
    openNewWindow,
    push,
  },
)
class LinkButton extends React.PureComponent {
  static propTypes = {
    /* eslint-disable react/forbid-foreign-prop-types */
    ...Button.propTypes,
    push: PropTypes.func.isRequired,
    to: PropTypes.string,
  };

  render() {
    const { push, onClick, openNewWindow, to, ...buttonProps } = this.props;
    let boundOnClick;

    if (onClick) {
      boundOnClick = onClick.bind(this);
    }

    buttonProps.onClick = event => {
      if (to) {
        let navAction = push;
        if (event.ctrlKey || event.metaKey || event.button === 1) {
          navAction = openNewWindow;
        }
        navAction(to);
      }
      if (boundOnClick) {
        boundOnClick(event);
      }
    };

    return <Button {...buttonProps}>{this.props.children}</Button>;
  }
}

export default LinkButton;

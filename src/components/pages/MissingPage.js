import { Button } from 'antd';
import PropTypes from 'prop-types';
import React from 'react';
import { connect } from 'react-redux';

import LostDino from 'console/components/svg/LostDino';
import { getCurrentPathname } from 'console/state/router/selectors';

@connect(state => ({ pathname: getCurrentPathname(state) }))
export default class MissingPage extends React.PureComponent {
  static propTypes = {
    pathname: PropTypes.string.isRequired,
  };

  render() {
    const issueUrl = 'https://github.com/mozilla/delivery-console/issues/new';
    return (
      <div className="content-wrapper page-missing">
        <div className="container">
          <div className="illustration">
            <LostDino />
          </div>
          <div className="text-container">
            <h1 className="title">Hmm. We're having trouble finding that page.</h1>
            <p>
              We can't find the page you are looking for:
              <br /> {this.props.pathname}.
            </p>
            <p>
              <strong>If that address is correct, here are some things you can try:</strong>
            </p>
            <ul>
              <li>Try again later.</li>
              <li>Go back to the previous page.</li>
              <li>
                Report&nbsp;
                <a href={issueUrl} target="_blank">
                  an issue
                </a>
                &nbsp;with Delivery Console.
              </li>
            </ul>
          </div>
          <div className="righted">
            <Button type="primary" onClick={() => window.history.back()}>
              Go Back
            </Button>
          </div>
        </div>
      </div>
    );
  }
}

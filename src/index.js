import React from 'react';
import ReactDOM from 'react-dom';
import DevConsoleApp from './console/App';

import Raven from 'raven-js';

if (process.env.REACT_APP_SENTRY_PUBLIC_DSN) {
  Raven.config(process.env.REACT_APP_SENTRY_PUBLIC_DSN).install();
}

ReactDOM.render(<DevConsoleApp />, document.getElementById('root'));

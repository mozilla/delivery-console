import React from 'react';
import ReactDOM from 'react-dom';
import DevConsoleApp from './console/App';

import Raven from 'raven-js';
Raven.config('https://<key>@sentry.prod.mozaws.net/delivery-console').install();

Raven.context(function() {
  ReactDOM.render(<DevConsoleApp />, document.getElementById('root'));
});

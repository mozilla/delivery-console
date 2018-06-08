import React from 'react';
import ReactDOM from 'react-dom';
import App from 'console/components/App';
import reducers from 'console/state/reducer';
import { Provider } from 'react-redux';
import { applyMiddleware, compose, createStore } from 'redux';
import thunk from 'redux-thunk';

import Raven from 'raven-js';

import { SENTRY_PUBLIC_DSN } from 'console/settings';

if (SENTRY_PUBLIC_DSN) {
  Raven.config(SENTRY_PUBLIC_DSN).install();
}

const middleware = [thunk];

const store = createStore(
  reducers,
  reducers(undefined, { type: 'initial' }),
  compose(applyMiddleware(...middleware)),
);

ReactDOM.render(
  <Provider store={store}>
    <App />
  </Provider>,
  document.getElementById('root'),
);

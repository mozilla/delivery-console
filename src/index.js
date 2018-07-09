import 'console/less/index.less';

import { connectRouter, routerMiddleware } from 'connected-react-router';
import { createBrowserHistory } from 'history';
import Raven from 'raven-js';
import consolePlugin from 'raven-js/dist/plugins/console';
import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import { applyMiddleware, compose, createStore } from 'redux';
import thunk from 'redux-thunk';

import App from 'console/components/App';
import { SENTRY_PUBLIC_DSN } from 'console/settings';
import reducers from 'console/state/reducer';

if (SENTRY_PUBLIC_DSN) {
  Raven.config(SENTRY_PUBLIC_DSN)
    .addPlugin(consolePlugin, window.console, { levels: ['warn', 'error'] })
    .install();
}

// Add support for Redux Devtools
const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;

const history = createBrowserHistory();

const middleware = [routerMiddleware(history), thunk];

const store = createStore(
  connectRouter(history)(reducers),
  reducers(undefined, { type: 'initial' }),
  composeEnhancers(applyMiddleware(...middleware)),
);

ReactDOM.render(
  <Provider store={store}>
    <App history={history} />
  </Provider>,
  document.getElementById('root'),
);

import React from 'react';
import { Provider } from 'react-redux';
import { applyMiddleware, compose, createStore } from 'redux';
import { initializeCurrentLocation } from 'redux-little-router';
import thunk from 'redux-thunk';

import './less/main.less';

import Router, {
  enhancer as routerEnhancer,
  middleware as routerMiddleware,
} from 'normandy/routes';
import reducers from 'normandy/state';

const middleware = [
  routerMiddleware,
  thunk,
];

const store = createStore(reducers, reducers(undefined, { type: 'initial' }), compose(
  applyMiddleware(...middleware),
  routerEnhancer,
));

const initialLocation = store.getState().router;
if (initialLocation) {
  store.dispatch(initializeCurrentLocation(initialLocation));
}

export default class Root extends React.PureComponent {
  render() {
    return (
      <div id="normandy-app">
        <Provider store={store}>
          <Router />
        </Provider>
      </div>
    );
  }
}

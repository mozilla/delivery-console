import React from 'react';
import { Provider } from 'react-redux';
import { applyMiddleware, compose, createStore } from 'redux';
import { initializeCurrentLocation } from 'redux-little-router';
import thunk from 'redux-thunk';

import { BrowserRouter, NavLink, Link, Switch } from 'react-router-dom';
import { Route, Redirect } from 'react-router';


import './less/main.less';

import Router, {
  enhancer as routerEnhancer,
  middleware as routerMiddleware,
} from 'normandy/routes';
import reducers from 'normandy/state';

const middleware = [routerMiddleware, thunk];

const store = createStore(
  reducers,
  reducers(undefined, { type: 'initial' }),
  compose(applyMiddleware(...middleware), routerEnhancer),
);

const initialLocation = store.getState().router;
if (initialLocation) {
  store.dispatch(initializeCurrentLocation(initialLocation));
}

export default class Root extends React.PureComponent {
  render() {
    const urlPrefix = this.props.urlPrefix || '';

    return (
      <Provider store={store}>
        {/* <BrowserRouter> */}
          <div id="normandy-app">
            <Switch>
              <Route exact path={`${urlPrefix}/`} component={() => <div>ok</div>} />
              <Route exact path={`${urlPrefix}/nested/`} component={() => <div>nested</div>} />
              <Route component={({ location }) => (
                <div>
                  <h3>No del-console match for <code>{location.pathname}</code></h3>
                </div>
              )} />
            </Switch>
          </div>
        {/* </BrowserRouter> */}
      </Provider>
    );
  }
}

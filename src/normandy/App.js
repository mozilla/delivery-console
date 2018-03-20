import React from 'react';
import { Provider } from 'react-redux';
import { applyMiddleware, compose, createStore } from 'redux';
import thunk from 'redux-thunk';

import NormandyRouter from './Router';


import './less/main.less';

import reducers from 'normandy/state';

<<<<<<< HEAD
const middleware = [routerMiddleware, thunk];

const store = createStore(
  reducers,
  reducers(undefined, { type: 'initial' }),
  compose(applyMiddleware(...middleware), routerEnhancer),
);
=======
const middleware = [
  thunk,
];

const store = createStore(reducers, reducers(undefined, { type: 'initial' }), compose(
  applyMiddleware(...middleware),
));
>>>>>>> Abstract NormandyRouter into component


export default class Root extends React.PureComponent {
  render() {
    const urlPrefix = this.props.urlPrefix;

    return (
      <Provider store={store}>
        <div id="normandy-app">
          <NormandyRouter urlPrefix={urlPrefix} />
        </div>
      </Provider>
    );
  }
}

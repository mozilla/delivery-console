import React from 'react';
import { Provider } from 'react-redux';
import { applyMiddleware, compose, createStore } from 'redux';
import thunk from 'redux-thunk';

import App from 'normandy/components/App';
import NormandyRouter, { NormandyLink } from './Router';


import './less/main.less';

import reducers from 'normandy/state';

const middleware = [
  thunk,
];

const store = createStore(reducers, reducers(undefined, { type: 'initial' }), compose(
  applyMiddleware(...middleware),
));


export default class Root extends React.Component {
  componentWillMount(){
    // `NormandyLinks` are wrapped Links which append a prefix for nested apps.
    // At this point we know the prefix, so we can update all instances of the
    // Link here via the static PREFIX property.
    NormandyLink.PREFIX = this.props.urlPrefix || '';
  }

  render() {
    const urlPrefix = this.props.urlPrefix;

    return (
      <Provider store={store}>
        <App>
          <NormandyRouter urlPrefix={urlPrefix} />
        </App>
      </Provider>
    );
  }
}

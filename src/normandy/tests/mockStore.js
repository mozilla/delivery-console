import React from 'react';
import { MemoryRouter } from 'react-router-dom';
import { Route, Redirect, Switch } from 'react-router';
import { Provider } from 'react-redux';
import { applyMiddleware, compose, createStore } from 'redux';
import thunk from 'redux-thunk';

import reducers from 'normandy/state';

export function createMockStore() {
  return createStore(
    reducers,
    reducers(undefined, { type: 'initial' }),
    compose(applyMiddleware(thunk)),
  );
}

export function wrapMockStore(element) {
  return (
    <Provider store={createMockStore()}>
      <MemoryRouter initialEntries={[ '/asdf/2' ]}>
        {element}
      </MemoryRouter>
    </Provider>
  );
}

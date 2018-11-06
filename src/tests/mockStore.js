import { ConnectedRouter, routerMiddleware } from 'connected-react-router/immutable';
import { createMemoryHistory } from 'history';
import React from 'react';
import { Provider } from 'react-redux';
import { applyMiddleware, compose, createStore } from 'redux';
import thunk from 'redux-thunk';

import createRootReducer from 'console/state/reducer';

const history = createMemoryHistory();

export const rootReducer = createRootReducer(history);

export const mockStore = createStore(
  rootReducer,
  rootReducer(undefined, { type: 'initial' }),
  compose(applyMiddleware(routerMiddleware(history), thunk)),
);

export function wrapMockStore(element) {
  return (
    <Provider store={mockStore}>
      <ConnectedRouter history={history} initialEntries={['/asdf/2']}>
        {element}
      </ConnectedRouter>
    </Provider>
  );
}

import {
  ConnectedRouter,
  connectRouter,
  routerMiddleware,
} from 'connected-react-router/immutable';
import { createMemoryHistory } from 'history';
import React from 'react';
import { Provider } from 'react-redux';
import { applyMiddleware, compose, createStore } from 'redux';
import thunk from 'redux-thunk';

import reducers from 'console/state/reducer';

const history = createMemoryHistory();

export const rootReducer = connectRouter(history)(reducers);

export const mockStore = createStore(
  rootReducer,
  reducers(undefined, { type: 'initial' }),
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

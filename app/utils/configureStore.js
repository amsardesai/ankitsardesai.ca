// @flow

import thunk from 'redux-thunk';
import { createStore, applyMiddleware } from 'redux';

import reducer from '../reducers';

import type { State } from '../reducers';

export default function configureStore(initialState: State) {
  const store = createStore(
    reducer,
    initialState,
    applyMiddleware(thunk),
  );

  return store;
}

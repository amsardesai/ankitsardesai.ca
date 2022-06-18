
// import thunk from 'redux-thunk';
import { createStore, applyMiddleware } from 'redux';

import reducer from '../reducers.js';

import type { State } from '../reducers.js';

export default function configureStore(initialState) {
  return createStore(
    reducer,
    initialState,
    // applyMiddleware(thunk),
  );
}

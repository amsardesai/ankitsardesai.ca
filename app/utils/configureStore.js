
import type { State } from '../reducer.js';

import thunk from 'redux-thunk';
import { createStore, applyMiddleware } from 'redux';
import reducer from '../reducer.js';

// Fix strange bug where thunk is not available in node environment
const thunkMiddleware = typeof thunk.default === 'function'
  ? thunk.default
  : thunk;

export default function configureStore(initialState) {
  return createStore(
    reducer,
    initialState,
    applyMiddleware(thunkMiddleware),
  );
}

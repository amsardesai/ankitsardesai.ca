
import type { State } from '../reducer.js';

// import thunk from 'redux-thunk';
import { createStore, applyMiddleware } from 'redux';
import reducer from '../reducer.js';

export default function configureStore(initialState) {
  return createStore(
    reducer,
    initialState,
    // applyMiddleware(thunk),
  );
}

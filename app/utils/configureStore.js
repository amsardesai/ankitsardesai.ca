
import promiseMiddleware from 'redux-promise';
import { createStore, applyMiddleware } from 'redux';

import reducers from '../reducers';

// No middleware yet
const createStoreWithMiddleware = applyMiddleware(
  promiseMiddleware
)(createStore);

export default function configureStore(initialState) {
  const store = createStoreWithMiddleware(reducers, initialState);

  // Webpack hot module replacement for reducers
  if (module.hot) {
    module.hot.accept('../reducers', () => {
      const nextRootReducer = require('../reducers');
      store.replaceReducer(nextRootReducer);
    });
  }

  return store;
}

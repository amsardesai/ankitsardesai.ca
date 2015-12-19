
// Import babel polyfill
import 'babel/polyfill';

// Import external modules
import React from 'react';
import Router from 'react-router';
import { createHistory } from 'history';
import { createStore, combineReducers } from 'redux';
import { Provider } from 'react-redux';
import { render } from 'react-dom';
import { syncReduxAndRouter, routeReducer } from 'redux-simple-router';

// Import internal modules
import reducers from './reducers/index';
import getRoutes from './utils/getRoutes';

// Create reducer, store, and history
const reducer = combineReducers(Object.assign({}, reducers, { routing: routeReducer }));
const store = createStore(reducer);
const history = createHistory();

// Sync history and store
syncReduxAndRouter(history, store);

// Get react-root object
const reactRoot = document.getElementById('react-root');

// Render application
render(
  <Provider store={store}>
    <Router history={history} routes={getRoutes()} />
  </Provider>,
  reactRoot
);


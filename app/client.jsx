
// Import babel polyfill before anything else
import 'babel-polyfill';

// Import external modules
import createBrowserHistory from 'history/lib/createBrowserHistory';
import React from 'react';
import Router from 'react-router';
import { Provider } from 'react-redux';
import { render } from 'react-dom';
import { syncReduxAndRouter } from 'redux-simple-router';

// Import internal modules
import configureStore from './utils/configureStore';
import getRoutes from './utils/getRoutes';

// Global isomorphic constants
window.__SERVER__ = false;
window.__CLIENT__ = true;

// Create reducer, store, and history
const store = configureStore(window.__INITIAL_STATE__);
const history = createBrowserHistory();

// Sync history and store
syncReduxAndRouter(history, store);

// Get react-root object
const reactRoot = document.getElementById('react-root');

// Render application
render(
  <Provider store={store}>
    <div>
      <Router history={history} routes={getRoutes()} />
    </div>
  </Provider>,
  reactRoot
);

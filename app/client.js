// @flow

// Import babel polyfill before anything else
import 'babel-polyfill';

// Import external modules
import React from 'react';
import { Provider } from 'react-redux';
import { render } from 'react-dom';

// Import internal modules
import configureStore from './utils/configureStore';
import Main from './components/Main';
import { loadGoogleAnalytics, trackPageView } from './utils/analytics';

// Global isomorphic constants
window.IS_SERVER = false;
window.IS_CLIENT = true;

// Load Google Analytics
loadGoogleAnalytics();

// Track Google Analytics page view
trackPageView(window.document.location);

// Create reducer, store, and history
const store = configureStore(window.INITIAL_STATE);

// Get react-root object
const reactRoot = document.getElementById('react-root');

// Render application
render(
  <Provider store={store}>
    <Main />
  </Provider>,
  reactRoot,
);

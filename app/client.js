
// Import babel polyfill before anything else
import '@babel/polyfill';

// Import external modules
import React from 'react';
import { Provider } from 'react-redux';
import { hydrateRoot } from 'react-dom/client';

// Import internal modules
import configureStore from './utils/configureStore.js';
import App from './components/App.js';
// import { loadGoogleAnalytics, trackPageView } from './utils/analytics.js';

// Global isomorphic constants
window.IS_SERVER = false;
window.IS_CLIENT = true;

// Track Google Analytics page view
// loadGoogleAnalytics();
// trackPageView(window.document.location);

// Hydrate server-side generated markup
hydrateRoot(
  document.getElementById('react-root'),
  <Provider store={configureStore(window.INITIAL_STATE)}>
    <App />
  </Provider>,
);

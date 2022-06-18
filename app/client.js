
// Import babel polyfill before anything else
import 'babel-polyfill';

// Import external modules
import React from 'react';
import { Provider } from 'react-redux';
import { createRoot } from 'react-dom/client';

// Import internal modules
import configureStore from './utils/configureStore';
import App from './components/App';
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
const root = createRoot(reactRoot);
root.render(
  <Provider store={store}>
    <App />
  </Provider>,
);

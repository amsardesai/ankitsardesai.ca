import 'core-js/stable/index.js';
import 'normalize.css';
import './main.css';

import redux from '@reduxjs/toolkit';
import React from 'react';
import { hydrateRoot } from 'react-dom/client';
import { Provider } from 'react-redux';

import * as analytics from './analytics.js';
import App from './app.js';
import type { State } from './reducer.js';
import reducer from './reducer.js';

declare global {
  interface Window {
    PRELOADED_STATE: State;
  }
}

const preloadedState = window.PRELOADED_STATE;

// Track Google Analytics page view
analytics.loadGoogleAnalytics();
analytics.trackPageView(window.document.location);

const rootElement = document.getElementById('react-root');
const store = redux.configureStore({ preloadedState, reducer });

// Hydrate server-side generated markup
if (rootElement != null) {
  hydrateRoot(
    rootElement,
    <Provider serverState={preloadedState} store={store}>
      <App />
    </Provider>,
  );
}

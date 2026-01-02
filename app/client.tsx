import 'core-js/stable/index.js';
import 'normalize.css';
import './main.css';

import React from 'react';
import { hydrateRoot } from 'react-dom/client';

import analytics from './analytics.js';
import App from './app.js';
import { AppContextProvider } from './AppContext.js';
import type { State } from './reducer.js';

declare global {
  interface Window {
    PRELOADED_STATE: State;
  }
}

const preloadedState = window.PRELOADED_STATE;

analytics.ready(payload => {
  console.log('ready', payload);
});

analytics.page();

const rootElement = document.getElementById('react-root');

// Hydrate server-side generated markup
if (rootElement != null) {
  hydrateRoot(
    rootElement,
    <AppContextProvider initialState={preloadedState}>
      <App />
    </AppContextProvider>,
  );
}

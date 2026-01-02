import { renderToString } from 'react-dom/server';

import App from './app.js';
import { AppContextProvider } from './AppContext.js';
import type { State } from './reducer.js';
import { getInitialState } from './reducer.js';

export function render(
  photoName: string,
  photoLocation: string,
): { html: string; initialState: State } {
  const initialState = getInitialState(photoName, photoLocation);

  const html = renderToString(
    <AppContextProvider initialState={initialState}>
      <App />
    </AppContextProvider>,
  );

  return { html, initialState };
}

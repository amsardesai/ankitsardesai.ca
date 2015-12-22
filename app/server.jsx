
// Import external modules
import compose from 'koa-compose';
import createLocation from 'history/lib/createLocation';
import favicon from 'koa-favicon';
import Helmet from 'react-helmet';
import koa from 'koa';
import mount from 'koa-mount';
import path from 'path';
import React from 'react';
import sendfile from 'koa-sendfile';
import serve from 'koa-static';
import { createStore, combineReducers } from 'redux';
import { Provider } from 'react-redux';
import { renderToString } from 'react-dom/server';
import { RoutingContext, match } from 'react-router';

// Import internal modules
import config from '../config';
import configureStore from './utils/configureStore';
import getRoutes from './utils/getRoutes';
import reducers from './reducers/index';
import * as api from './server/api';
import { all } from './utils/database';

// Launch Koa application
const app = koa();
const port = process.env.PORT || config.ports.koa;

// Add our isomorphic constants
global.__SERVER__ = true;
global.__CLIENT__ = false;

// Paths to javascript/css files
let jsPath, cssPath;

// Use build directory as assets
app.use(mount('/assets/', serve(path.join(__dirname, '..', config.files.staticAssets))));

// Serve the favicon
app.use(favicon(path.join(__dirname, '..', 'assets', 'favicon.ico')));

// Serve the resume
app.use(mount('/resume', function* (next) {
  yield* sendfile.call(this, path.join(__dirname, '..', 'assets', 'resume.pdf'));
}));

// Serve database API routes
app.use(compose(Object.keys(api).map(key => api[key])));

// Store output files and directory for client JS and CSS files.
let jsOutFile = config.files.client.outFile;
let jsOutDir = config.files.client.out;
let cssOutFile = 'master.css';
let cssOutDir = config.files.css.out;

if (process.env.NODE_ENV === 'production') {
  // In production, our node context will be under the root directory, so we need to include the
  // build folder in our path when getting the manifest file.

  // Get the manifest files for our CSS and JS files
  let jsManifest = JSON.parse(fs.readFileSync('./build/static/js/rev-manifest.json', 'utf-8'));
  let cssManifest = JSON.parse(fs.readFileSync('./build/static/css/rev-manifest.json', 'utf-8'));

  // If we're in production, we want to make the build directory a static directory in /assets
  jsPath = `/assets/${jsOutDir}/${jsManifest[jsOutFile]}`;
  cssPath = `/assets/${cssOutDir}/${cssManifest[cssOutFile]}`;
} else {
  // If we're in development, we want to point to webpack-dev-server.
  jsPath = `http://localhost:${config.ports.webpack}/${jsOutDir}/${jsOutFile}`;
  cssPath = `http://localhost:${config.ports.webpack}/${cssOutDir}/${cssOutFile}`;
}

// Capture all requests
app.use(function* (next) {

  // Get initial image to display
  const initialBackgrounds = yield all('SELECT name, position FROM backgrounds ' +
                                       'ORDER BY RANDOM() LIMIT 2');

  // Match a specific route
  match({
    routes: getRoutes(),
    location: createLocation(this.req.url),
  }, (error, redirectLocation, renderProps) => {

    // Invariant checks on route
    if (redirectLocation) {
      this.redirect(redirectLocation.pathname, redirectLocation.search);
      this.body = 'Redirecting...';
    } else if (error) {
      this.status = 500;
      if (process.env.NODE_ENV === 'development') {
        this.body = { error: true, content: error };
      } else {
        this.body = '500 ERROR';
      }
    } else if (!renderProps) {
      this.status = 404;
      this.body = '404 NOT FOUND';
    } else {

      // Catch possible rendering errors
      try {

        // Generate initial state
        const initialState = {
          background: {
            current: {
              name: initialBackgrounds[0].name,
              position: initialBackgrounds[0].position,
            },
            next: {
              name: initialBackgrounds[1].name,
              position: initialBackgrounds[1].position,
            },
          },
          routing: {},
        };

        // Render entire website
        const store = configureStore(initialState);
        const renderedString = renderToString(
          <Provider store={store}>
            <div>
              <RoutingContext {...renderProps} />
            </div>
          </Provider>
        );

        // Serialize state to send to client
        const serializedState = JSON.stringify(store.getState());

        // Get HEAD info for specific route
        const { title, meta, link } = Helmet.rewind();

        // Generate output
        this.status = 200;
        this.body =
          `<!DOCTYPE html>
          <html>
            <head>
              <meta charset="utf-8" />
              <meta name="viewport" content="width=device-width,initial-scale=1" />
              ${meta}
              <title>${title}</title>
              <link rel="stylesheet" href="${cssPath}" />
              ${link}
            </head>
            <body>
              <div id="react-root">${renderedString}</div>
              <script>window.__INITIAL_STATE__ = ${serializedState}</script>
              <script src="${jsPath}"></script>
            </body>
          </html>`;

      } catch (err) {
        this.status = 500;
        if (process.env.NODE_ENV === 'development') {
          this.body = { error: true, content: err.message, stack: err.stack.split('\n') };
        } else {
          this.body = '500 ERROR';
        }
      }
    }
  });
})

app.listen(port, () => {
  console.log(`ankitsardesai server listening on port ${port}`);
});


// Import external modules
import createLocation from 'history/lib/createLocation';
import Helmet from 'react-helmet';
import koa from 'koa';
import path from 'path';
import React from 'react';
import serve from 'koa-static';
import { createStore, combineReducers } from 'redux';
import { renderToString } from 'react-dom/server';
import { RoutingContext, match } from 'react-router';

// Import internal modules
import config from '../config';
import reducers from './reducers/index';

// Launch Koa application
const app = koa();
const port = process.env.PORT || config.ports.koa;

// Add our isomorphic constants
global.__SERVER__ = true;
global.__CLIENT__ = false;

// Create logger


// Paths to javascript/css files
let jsPath, cssPath;

// Use build directory as assets
app.use(mount('/assets/', serve(path.join(__dirname, '..', config.files.staticAssets))));

// Store output files and directory for client JS and CSS files.
let jsOutFile = config.files.client.outFile;
let jsOutDir = config.files.client.out;
let cssOutFile = 'main.css';
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

  let routes = getRoutes();
  let location = createLocation(this.req.url);

  match({ routes, location }, (error, redirectLocation, renderProps) => {
    if (redirectLocation) {
      this.redirect(redirectLocation.pathname, redirectLocation.search);
      this.body = 'Redirecting...';
    } else if (error) {
      this.status = 500;
      if (process.env.NODE_ENV === 'development') {
        this.body = error.message;
      } else {
        this.body = '500 ERROR';
      }
    } else if (renderProps === null) {
      this.status = 404;
      this.body = '404 NOT FOUND';
    } else {

      // Catch possible rendering errors
      try {

        const store = createStore(reducers);

        const renderedString = renderToString(
          <Provider store={store}>
            <RoutingContext {...renderProps} />
          </Provider>
        );

        const { title, meta, link } = Helmet.rewind();

        // Generate output.
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
              <script type="text/inline-data" id="react-data">${inlineData}</script>
              <script src="${jsPath}"></script>
            </body>
          </html>`;

      } catch (err) {
        this.status = 500;
        if (process.env.NODE_ENV === 'development') {
          this.body = err;
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


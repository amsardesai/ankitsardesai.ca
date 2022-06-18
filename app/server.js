
// Import external modules
import compose from 'koa-compose';
import favicon from 'koa-favicon';
import fs from 'fs';
import Helmet from 'react-helmet';
import Koa from 'koa';
import mount from 'koa-mount';
import * as React from 'react';
import route from 'koa-route';
import sendfile from 'koa-sendfile';
import serve from 'koa-static';
import { Provider } from 'react-redux';
import { renderToString } from 'react-dom/server';
import { dirname, join } from 'path';
import { fileURLToPath } from 'url';

// Import internal modules
import config from '../config.js';
import configureStore from './utils/configureStore.js';
import App from './components/App.js';
import * as api from './server/api.js';
import { all } from './utils/database.js';

const __dirname = dirname(fileURLToPath(import.meta.url));

// Launch Koa application
const app = new Koa();
const port = process.env.PORT || config.ports.koa;

// Add our isomorphic constants
global.IS_SERVER = true;
global.IS_CLIENT = false;

// Paths to javascript/css files
let jsPath;
let cssPath;

// Use build directory as assets
app.use(mount('/assets/', serve(join(__dirname, '..', config.files.staticAssets))));

// Serve the favicon
app.use(favicon(join(__dirname, '..', 'assets', 'favicon.ico')));

// Serve the resume
app.use(route.get('/resume', async (ctx) => {
  await sendfile(ctx, join(__dirname, '..', 'assets', 'resume.pdf'));
}));

// Serve the pgp key
app.use(route.get('/pgp', async (ctx) => {
  ctx.set('Cache-Control', 'no-cache');
  ctx.set('Content-Disposition', 'attachment; filename=ankit.asc');
  await sendfile(ctx, join(__dirname, '..', 'assets', 'pgp.asc'));
}));

// Serve the robots.txt file
app.use(route.get('/robots.txt', async (ctx) => {
  await sendfile(ctx, join(__dirname, '..', 'assets', 'robots.txt'));
}));

// Serve database API routes
app.use(compose(Object.keys(api).map(key => api[key])));

// Store output files and directory for client JS and CSS files.
const jsOutFile = config.files.client.outFile;
const jsOutDir = config.files.client.out;
const cssOutFile = 'master.css';
const cssOutDir = config.files.css.out;

if (process.env.NODE_ENV === 'production') {
  // In production, our node context will be under the root directory, so we need to include the
  // build folder in our path when getting the manifest file.

  // Get the manifest files for our CSS and JS files
  const jsManifest = JSON.parse(fs.readFileSync('./build/static/js/rev-manifest.json', 'utf-8'));
  const cssManifest = JSON.parse(fs.readFileSync('./build/static/css/rev-manifest.json', 'utf-8'));

  // If we're in production, we want to make the build directory a static directory in /assets
  jsPath = `/assets/${jsOutDir}/${jsManifest[jsOutFile]}`;
  cssPath = `/assets/${cssOutDir}/${cssManifest[cssOutFile]}`;
} else {
  // If we're in development, we want to point to webpack-dev-server.
  jsPath = `http://localhost:${config.ports.webpack}/${jsOutDir}/${jsOutFile}`;
  cssPath = `http://localhost:${config.ports.webpack}/${cssOutDir}/${cssOutFile}`;
}

// Capture main route
app.use(route.get('/', async (ctx) => {
  // Get initial image to display
  const initialBackgrounds = await all('SELECT name, location FROM backgrounds ' +
                                       'ORDER BY RANDOM() LIMIT 2');

  // Generate initial state
  const initialState = {
    current: {
      name: initialBackgrounds[0].name,
      location: initialBackgrounds[0].location,
    },
    next: {
      name: initialBackgrounds[1].name,
      location: initialBackgrounds[1].location,
    },
  };

  // Render entire website
  const store = configureStore(initialState);
  const renderedString = renderToString(
    <Provider store={store}>
      <App />
    </Provider>,
  );

  // Serialize state to send to client
  const serializedState = JSON.stringify(store.getState());

  // Get HEAD info for specific route
  const { title, meta, link } = Helmet.renderStatic();

  // Generate output
  ctx.status = 200;
  ctx.body =
    `<!DOCTYPE html>
    <html>
      <head>
        ${meta.toString()}
        ${title.toString()}
        <link rel="stylesheet" href="${cssPath}" />
        ${link.toString()}
      </head>
      <body>
        <div id="react-root">${renderedString}</div>
        <script>window.INITIAL_STATE = ${serializedState}</script>
        <script src="${jsPath}"></script>
      </body>
    </html>`;
}));

app.listen(port, () => {
  console.log(`ankitsardesai server listening on port ${port}`); // eslint-disable-line no-console
});

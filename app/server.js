
// Import external modules
import favicon from 'koa-favicon';
import fs from 'fs';
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
import { all } from './utils/sqlite3.js';

const __dirname = dirname(fileURLToPath(import.meta.url));

// Launch Koa application
const app = new Koa();
const port = process.env.PORT || config.ports.koa;

// Add our isomorphic constants
// global.IS_SERVER = true;
// global.IS_CLIENT = false;

// Use build directory as assets
app.use(mount('/assets/', serve(join(__dirname, '../build/static/'))));

// Serve the favicon
app.use(favicon(join(__dirname, '../assets/favicon.ico')));

// Serve the resume
app.use(route.get('/resume', async (ctx) => {
  await sendfile(ctx, join(__dirname, '../assets/resume.pdf'));
}));

// Serve the pgp key
app.use(route.get('/pgp', async (ctx) => {
  ctx.set('Cache-Control', 'no-cache');
  ctx.set('Content-Disposition', 'attachment; filename=ankit.asc');
  await sendfile(ctx, join(__dirname, '../assets/pgp.asc'));
}));

// Serve the robots.txt file
app.use(route.get('/robots.txt', async (ctx) => {
  await sendfile(ctx, join(__dirname, '../assets/robots.txt'));
}));

// Serve endpoint for receiving next photo
app.use(route.get('/api/next_photo', async (ctx) => {
  try {
    const { query } = ctx.request;
    const prevName = (query && query.prev) || '';
    const curName = (query && query.current) || '';
    const { name, location } = await get('SELECT name, location FROM photo ' +
                                         'WHERE name != ? AND name != ?' +
                                         'ORDER BY RANDOM() LIMIT 1', prevName, curName);
    ctx.status = 200;
    ctx.body = { name, location };
  } catch (err) {
    ctx.status = 500;
  }
}))

// Paths to javascript/css files
let jsPath = '';
let cssPath = '';

if (process.env.NODE_ENV === 'production') {
  // Check manifest files for latest hashes for js/css bundles
  const manifest = JSON.parse(fs.readFileSync('./build/static/rev-manifest.json', 'utf-8'));
  jsPath = `/assets/${manifest['bundle.js']}`;
  cssPath = `/assets/${manifest['styles.css']}`;
} else {
  // In development mode, point to webpack-dev-server.
  jsPath = `http://localhost:${config.ports.webpack}/bundle.js`;
  cssPath = `http://localhost:${config.ports.webpack}/styles.css`;
}

// Capture main route
app.use(route.get('/', async (ctx) => {
  // Get initial image to display
  const initialPhotos = await all('SELECT name, location FROM photos ORDER BY RANDOM() LIMIT 2');

  // Generate initial state
  const initialState = {
    current: {
      name: initialPhotos[0].name,
      location: initialPhotos[0].location,
    },
    next: {
      name: initialPhotos[1].name,
      location: initialPhotos[1].location,
    },
  };

  const store = configureStore(initialState)
  const renderedString = renderToString(
    <Provider store={store}>
      <App />
    </Provider>,
  );

  // Serialize state to send to client
  const serializedState = JSON.stringify(store.getState());

  // Generate output
  ctx.status = 200;
  ctx.body =
    '<!DOCTYPE html><html><head>' +
    '<meta charset="utf-8" />' +
    '<meta name="viewport" content="width=device-width,initial-scale=1" />' +
    '<meta property="og:title" content="Ankit Sardesai" />' +
    '<meta property="og:type" content="website" />' +
    '<meta property="og:image" content="https://cdn.ankitsardesai.ca/assets/profile.jpg" />' +
    '<meta property="og:url" content="https://ankitsardesai.ca" />' +
    '<title>Ankit Sardesai</title>' +
    '<link rel="stylesheet" href="' + cssPath + '" />' +
    '<script defer src="' + jsPath + '"></script>' +
    '</head><body>' +
    '<div id="react-root">' + renderedString + '</div>' +
    '<script>window.INITIAL_STATE=' + serializedState + '</script>' +
    '</body></html>';
}));

app.listen(port, () => {
  console.log(`ankitsardesai server listening on port ${port}`); // eslint-disable-line no-console
});

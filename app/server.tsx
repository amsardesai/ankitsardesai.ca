import express from 'express';
import fs from 'fs';
import { dirname, join } from 'path';
import * as React from 'react';
import { renderToString } from 'react-dom/server';
import favicon from 'serve-favicon';
import sqlite3 from 'sqlite3';
import { fileURLToPath } from 'url';

import App from './app.js';
import { AppContextProvider } from './AppContext.js';
import type { Photo } from './reducer.js';
import { getInitialState } from './reducer.js';

const __dirname = dirname(fileURLToPath(import.meta.url));

// Launch Express application
const app = express();
const port = process.env.PORT || 5092;

// Launch sqlite3 database
const db = new sqlite3.Database(join(__dirname, '../database.db'));

// Serve built files
app.use('/static', express.static(join(__dirname, '../build/static/')));

// Serve assets
app.use('/', express.static(join(__dirname, '../assets/')));

// Serve the favicon
app.use(favicon(join(__dirname, '../assets/favicon.ico')));

// Serve endpoint for receiving next photo
app.get('/api/getNextPhoto/:previousPhoto', (req, res) => {
  const previousPhoto = req.params.previousPhoto;
  db.get(
    'SELECT name, location FROM photos WHERE name != ? ORDER BY RANDOM() LIMIT 1',
    previousPhoto,
    (err: Error | null, row: Photo) => {
      if (err == null) {
        res.send({ location: row.location, name: row.name });
      } else {
        res.sendStatus(500);
      }
    },
  );
});

// Paths to javascript/css files
let jsPath = '';
let cssPath = '';

if (process.env.NODE_ENV === 'production') {
  // Check manifest files for latest hashes for js/css bundles
  const manifest = JSON.parse(
    fs.readFileSync('./build/static/rev-manifest.json', 'utf-8'),
  );
  jsPath = `/static/${manifest['bundle.js']}`;
  cssPath = `/static/${manifest['styles.css']}`;
} else {
  // In development mode, point to webpack-dev-server.
  jsPath = `http://localhost:8080/bundle.js`;
  cssPath = `http://localhost:8080/styles.css`;
}

// Capture main route
app.get('/', (_req, res) => {
  db.get(
    'SELECT name, location FROM photos ORDER BY RANDOM() LIMIT 1',
    (err: Error | null, row: Photo) => {
      if (err == null) {
        const initialPhoto = row;
        const initialState = getInitialState(
          initialPhoto.name,
          initialPhoto.location,
        );

        const renderedString = renderToString(
          <AppContextProvider initialState={initialState}>
            <App />
          </AppContextProvider>,
        );

        // Serialize state to send to client
        const serializedState = JSON.stringify(initialState);

        // Send output
        res.send(
          '<!DOCTYPE html><html><head>' +
            '<meta charset="utf-8" />' +
            '<meta name="viewport" content="width=device-width,initial-scale=1" />' +
            '<meta property="og:title" content="Ankit Sardesai" />' +
            '<meta property="og:type" content="website" />' +
            '<meta property="og:image" content="https://cdn.ankitsardesai.ca/assets/profile.jpg" />' +
            '<meta property="og:url" content="https://ankitsardesai.ca" />' +
            '<title>Ankit Sardesai</title>' +
            '<link rel="stylesheet" href="' +
            cssPath +
            '" /><script defer src="' +
            jsPath +
            '"></script></head><body><div id="react-root">' +
            renderedString +
            '</div><script>window.PRELOADED_STATE=' +
            serializedState +
            '</script></body></html>',
        );
      } else {
        res.sendStatus(500);
        throw err;
      }
    },
  );
});

app.listen(port, () => {
  console.log(`ankitsardesai server listening on port ${port}`); // eslint-disable-line no-console
});

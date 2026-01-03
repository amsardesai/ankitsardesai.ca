import express from 'express';
import fs from 'fs';
import helmet from 'helmet';
import { dirname, join } from 'path';
import pino from 'pino';
import favicon from 'serve-favicon';
import sqlite3 from 'sqlite3';
import { fileURLToPath } from 'url';
import type { ViteDevServer } from 'vite';

import type { Photo, State } from './reducer.js';

const __dirname = dirname(fileURLToPath(import.meta.url));
const isProduction = process.env.NODE_ENV === 'production';

// Structured logger - pretty print in dev, JSON in production
const logger = pino({
  level: process.env.LOG_LEVEL || 'info',
  transport: isProduction ? undefined : { target: 'pino-pretty', options: { colorize: true } },
});

// Build production HTML template with correct asset paths from manifest
function getProductionTemplate(): string {
  const manifestPath = './build/client/.vite/manifest.json';
  const manifest = JSON.parse(fs.readFileSync(manifestPath, 'utf-8'));
  const entry = manifest['app/client.tsx'];

  let template = fs.readFileSync('./index.html', 'utf-8');

  // Replace dev script with production script (manifest paths already include 'assets/')
  template = template.replace(
    '<script type="module" src="/app/client.tsx"></script>',
    `<script type="module" src="/${entry.file}"></script>`,
  );

  // Add CSS link in head (manifest paths already include 'assets/')
  if (entry.css && entry.css.length > 0) {
    const cssLinks = entry.css
      .map((css: string) => `<link rel="stylesheet" href="/${css}">`)
      .join('\n  ');
    template = template.replace('<!--head-tags-->', cssLinks);
  }

  return template;
}

// Helper to get random photo from database (exported for testing)
export function getRandomPhoto(db: sqlite3.Database): Promise<Photo> {
  return new Promise((resolve, reject) => {
    db.get(
      'SELECT name, location FROM photos ORDER BY RANDOM() LIMIT 1',
      (err: Error | null, row: Photo) => {
        if (err) reject(err);
        else resolve(row);
      },
    );
  });
}

// Helper to get next photo (different from previous) (exported for testing)
export function getNextPhoto(db: sqlite3.Database, previousPhoto: string): Promise<Photo> {
  return new Promise((resolve, reject) => {
    db.get(
      'SELECT name, location FROM photos WHERE name != ? ORDER BY RANDOM() LIMIT 1',
      previousPhoto,
      (err: Error | null, row: Photo) => {
        if (err) reject(err);
        else resolve(row);
      },
    );
  });
}

// Create Express app with API routes (exported for testing)
export function createApiApp(db: sqlite3.Database): express.Application {
  const app = express();

  // Health check endpoint for container orchestration
  app.get('/health', (_req, res) => {
    res.status(200).json({ status: 'ok', timestamp: new Date().toISOString() });
  });

  // API endpoint for getting next photo
  app.get('/api/getNextPhoto/:previousPhoto', async (req, res) => {
    try {
      const photo = await getNextPhoto(db, req.params.previousPhoto);
      res.json({ location: photo.location, name: photo.name });
    } catch {
      res.sendStatus(500);
    }
  });

  return app;
}

async function createServer(): Promise<void> {
  const app = express();
  const port = process.env.PORT || 5092;

  // Security headers (CSP, X-Frame-Options, X-Content-Type-Options, etc.)
  app.use(
    helmet({
      contentSecurityPolicy: {
        directives: {
          defaultSrc: ["'self'"],
          scriptSrc: ["'self'", "'unsafe-inline'"], // Needed for inline preloaded state
          styleSrc: ["'self'", "'unsafe-inline'"], // Needed for StyleX
          imgSrc: ["'self'", 'data:', 'https://cdn.ankitsardesai.ca'],
          connectSrc: ["'self'"],
        },
      },
    }),
  );

  // Health check endpoint for container orchestration
  app.get('/health', (_req, res) => {
    res.status(200).json({ status: 'ok', timestamp: new Date().toISOString() });
  });

  // Launch sqlite3 database
  const db = new sqlite3.Database(join(__dirname, '../database.db'));

  // Vite dev server (only in development)
  let vite: ViteDevServer | undefined;
  if (!isProduction) {
    const { createServer: createViteServer } = await import('vite');
    vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'custom',
    });
    app.use(vite.middlewares);
  } else {
    // Serve built client assets in production
    app.use('/assets', express.static(join(__dirname, '../build/client/assets')));
  }

  // Serve static assets (photos, etc.)
  app.use('/', express.static(join(__dirname, '../assets/')));

  // Serve the favicon
  app.use(favicon(join(__dirname, '../assets/favicon.ico')));

  // API endpoint for getting next photo
  app.get('/api/getNextPhoto/:previousPhoto', async (req, res) => {
    try {
      const photo = await getNextPhoto(db, req.params.previousPhoto);
      res.json({ location: photo.location, name: photo.name });
    } catch {
      res.sendStatus(500);
    }
  });

  // SSR route
  app.get('/', async (req, res) => {
    try {
      const photo = await getRandomPhoto(db);

      let template: string;
      let render: (name: string, location: string) => { html: string; initialState: State };

      if (!isProduction && vite) {
        // Development: Read template and transform with Vite
        template = fs.readFileSync('./index.html', 'utf-8');
        template = await vite.transformIndexHtml(req.url, template);
        // Load SSR module through Vite (enables HMR)
        const entryModule = await vite.ssrLoadModule('/app/entry-server.tsx');
        render = entryModule.render;
      } else {
        // Production: Build template from manifest and import built SSR module
        template = getProductionTemplate();
        const serverEntryPath = '../build/server/entry-server.js';
        const entryModule: { render: typeof render } = await import(
          /* @vite-ignore */ serverEntryPath
        );
        render = entryModule.render;
      }

      const { html, initialState } = render(photo.name, photo.location);

      // Inject rendered HTML and preloaded state
      const finalHtml = template
        .replace('<!--app-html-->', html)
        .replace(
          '<!--preloaded-state-->',
          `<script>window.PRELOADED_STATE=${JSON.stringify(initialState)}</script>`,
        );

      res.status(200).set({ 'Content-Type': 'text/html' }).send(finalHtml);
    } catch (err) {
      // Let Vite fix the stack trace in dev mode
      if (!isProduction && vite) {
        vite.ssrFixStacktrace(err as Error);
      }
      logger.error({ err }, 'SSR render error');
      res.sendStatus(500);
    }
  });

  app.listen(port, () => {
    logger.info({ port }, 'Server listening');
  });
}

// Only start server when run directly (not when imported for testing)
if (process.argv[1] === fileURLToPath(import.meta.url)) {
  createServer();
}

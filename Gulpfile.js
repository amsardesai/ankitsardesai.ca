'use strict'; // eslint-disable-line strict

// Import external modules
import babel from 'gulp-babel';
import browserSync from 'browser-sync';
import cache from 'gulp-cached';
import colors from 'ansi-colors';
import del from 'del';
import eslint from 'gulp-eslint-new';
import fs from 'fs';
import log from 'fancy-log';
import gulp from 'gulp';
import nodemon from 'nodemon';
import path from 'path';
import PluginError from 'plugin-error';
import plumber from 'gulp-plumber';
import prefix from 'gulp-autoprefixer';
import pretty from 'prettysize';
import rev from 'gulp-rev';
import revdel from 'gulp-rev-delete-original';
import size from 'gulp-size';
import sourcemaps from 'gulp-sourcemaps';
import ts from 'gulp-typescript';
import webpack from 'webpack';
import WebpackDevServer from 'webpack-dev-server';

// import internal modules
import { PORT_KOA } from './ports.js';
import webpackProdConfig from './webpack.config.js';
import webpackDevConfig from './webpack.dev.config.js';

const ALL_JS_FILES = './app/**/**/**/**/*.{js,ts}';

/**
 * Compile server files.
 */
function buildServer() {
  return gulp.src(ALL_JS_FILES)
    .pipe(cache('server'))
    .pipe(plumber())
    .pipe(sourcemaps.init())
    .pipe(babel({
      presets: [
        ['@babel/preset-typescript', { isTSX: true, allExtensions: true }],
        ['@babel/preset-react'],
      ],
      plugins: [
        ['style9/babel'],
      ]
     }))
    .pipe(sourcemaps.write())
    .pipe(size({ title: 'Server JS' }))
    .pipe(gulp.dest('build'));
}


// Emulate gulp-size
function renderOutputSize(name) {
  let outputConfig = webpackProdConfig.output;
  let jsFilePath = path.join(outputConfig.path, outputConfig.filename);
  log(`${colors.cyan(name)} ${colors.green('all files ')}` +
            `${colors.magenta(pretty(fs.statSync(jsFilePath).size))}`);
}

/**
 * Compile JS files for development and launch webpack-dev-server.
 */
let startedDevServer = false;
function buildClient(callback) {
  const devCompiler = webpack(
    webpackDevConfig,
    err => {
      if (err) throw new PluginError('buildClient', err);
      renderOutputSize('Client Dev JS');

      if (startedDevServer) {
        callback();
      } else {
        startedDevServer = true;

        const server = new WebpackDevServer(
          webpackDevConfig.devServer,
          devCompiler,
        );

        // Start the dev server
        server.startCallback(callback);
      }
    },
  );
}

/**
 * Compile JS files for production.
 */
function buildClientProd(callback) {
  webpack(
    webpackProdConfig,
    err => {
      if (err) throw new PluginError('buildClient', err);
      renderOutputSize('Client Prod JS');
      callback();
    },
  );
}

/**
 * Duplicate CSS and JS files with hashes append to their names, so we can enable long term
 * caching.
 */
function buildCache() {
  return gulp.src(`build/static/*.{js,css}`)
    .pipe(rev())
    .pipe(revdel())
    .pipe(gulp.dest(`build/static`))
    .pipe(rev.manifest())
    .pipe(gulp.dest(`build/static`));
}

/**
 * Check types in all JS files
 */
function checkTypes() {
  return gulp.src(ALL_JS_FILES)
    .pipe(ts({
      noEmitOnError: true,
      allowJs: true,
    }))
}

/**
 * Lint all JS files, and fail on error. Useful on CI machines and build scripts.
 */
export const lintProd = gulp.series(
  // checkTypes,
  function lintProd() {
    return gulp.src(ALL_JS_FILES)
      .pipe(eslint())
      .pipe(eslint.format())
      .pipe(eslint.failAfterError());
  },
);

/**
 * Lint all JS files.
 */
export function lint() {
  return gulp.src(ALL_JS_FILES)
    .pipe(cache('lint'))
    .pipe(eslint())
    .pipe(eslint.format());
}

/**
 * Clean out build folder so we build from scratch.
 */
export function clean() {
  return del(['build']);
}

/**
 * Task to compile our files for production.
 */
export const compile = gulp.series(
  clean,
  lintProd,
  gulp.parallel(
    buildClientProd,
    buildServer,
  ),
  buildCache,
);


/**
 * Task to compile our files for production, ignoring linting.
 */
export const compileNoLint = gulp.series(
  clean,
  gulp.parallel(
    buildClientProd,
    buildServer,
  ),
  buildCache,
);

/**
 * Watch the necessary directories and launch BrowserSync.
 */
export const watch = gulp.series(
  clean,
  lint,
  gulp.parallel(
    buildClient,
    buildServer,
  ),
  function startServer(callback) {
    // Watch files
    gulp.watch(ALL_JS_FILES, buildClient);
    gulp.watch(ALL_JS_FILES, buildServer);
    gulp.watch(ALL_JS_FILES, lint);

    // Launch Nodemon
    nodemon({
      env: { NODE_ENV: 'development' },
      watch: [ 'build' ],
      ignore: [ 'build/static' ],
    });

    // Boolean to check if BrowserSync has started.
    let isBrowserSyncStarted = false;

    // Perform action right when nodemon starts
    nodemon.on('start', () => {

      // Only perform action when boolean is false
      if (!isBrowserSyncStarted) {
        isBrowserSyncStarted = true;

        // Set a timeout of 500 ms so that the server has time to start
        setTimeout(() => {

          // Launch BrowserSync
          browserSync({
            proxy: `localhost:${PORT_KOA}`,
            open: false,
          });

          callback();
        }, 500);
      }
    });
  },
);


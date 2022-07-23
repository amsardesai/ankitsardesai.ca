'use strict'; // eslint-disable-line strict

// Import external modules
import babel from 'gulp-babel';
import browserSync from 'browser-sync';
import cache from 'gulp-cached';
import colors from 'ansi-colors';
import del from 'del';
import eslint from 'gulp-eslint';
import fs from 'fs';
import log from 'fancy-log';
import gulp from 'gulp';
// import cleanCss from 'gulp-clean-css';
import nodemon from 'nodemon';
import path from 'path';
import PluginError from 'plugin-error';
import plumber from 'gulp-plumber';
import prefix from 'gulp-autoprefixer';
import pretty from 'prettysize';
// import reload from 'ync.reload;
import rev from 'gulp-rev';
import revdel from 'gulp-rev-delete-original';
//import sass from 'gulp-sass');
import size from 'gulp-size';
import sourcemaps from 'gulp-sourcemaps';
import webpack from 'webpack';
import WebpackDevServer from 'webpack-dev-server';

// import internal modules
import config from './config.js';
import webpackProdConfig from './webpack.config.js';
import webpackDevConfig from './webpack.dev.config.js';

/**
 * Compile our CSS files
 */
// function buildCSS() {
  // return gulp.src(config.files.css.entry)
    // .pipe(plumber())
   // .pipe(sass(config.build.sass))
    // .pipe(prefix(config.build.autoprefixer))
    // .pipe(size({ title: 'CSS' }))
    // .pipe(gulp.dest(`${config.files.staticAssets}${config.files.css.out}`))
    // .pipe(reload({ stream: true }));
// }

/**
 * Compile our CSS files for production. This minifies our CSS as well.
 */
// function buildCSSProd() {
  // return gulp.src(config.files.css.entry)
  // //  .pipe(sass(config.build.sass))
    // .pipe(prefix(config.build.autoprefixer))
    // .pipe(minifyCss())
    // .pipe(size({ title: 'CSS' }))
    // .pipe(gulp.dest(`${config.files.staticAssets}${config.files.css.out}`));
// }

/**
 * Lint all our JS files.
 */
// function buildLint() {
  // return gulp.src('./app/**/**/**/**/*.js')
    // .pipe(cache('build:lint'))
    // .pipe(eslint())
    // .pipe(eslint.format());
// );

/**
 * Lint all our JS files, and fail on error. Useful on CI machines and build scripts.
 */
// function buildLintProd() {
  // return gulp.src('./app/**/**/**/**/*.js')
    // .pipe(eslint())
    // .pipe(eslint.format())
    // .pipe(eslint.failOnError());
// }

/**
 * Compile server files.
 */
function buildServer() {
  return gulp.src('./app/**/**/**/*.js')
    .pipe(cache('src:server'))
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
      if (err) throw new PluginError('build:client', err);
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
      if (err) throw new PluginError('build:client', err);
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
  // buildLintProd,
  gulp.parallel(
    buildClientProd,
    buildServer,
  ),
  buildCache
)


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
  // buildLint,
  gulp.parallel(
    buildClient,
    buildServer,
  ),
  function startServer(callback) {
    // Watch files
    // gulp.watch('./app/**/**/**/**/*.js', buildClient);
    gulp.watch('./app/**/**/**/**/*.js', buildServer);
    // gulp.watch('./app/**/**/**/**/*.js', buildLint);

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
            proxy: `localhost:${config.ports.koa}`,
            open: false,
          });

          callback();
        }, 500);
      }
    });
  },
)


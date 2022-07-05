'use strict'; // eslint-disable-line strict

// Import external modules
const babel = require('gulp-babel');
const browserSync = require('browser-sync');
const cache = require('gulp-cached');
const colors = require('ansi-colors');
const del = require('del');
const eslint = require('gulp-eslint');
const fs = require('fs');
const log = require('fancy-log');
const gulp = require('gulp');
// const cleanCss = require('gulp-clean-css');
const nodemon = require('nodemon');
const path = require('path');
const PluginError = require('plugin-error');
const plumber = require('gulp-plumber');
const prefix = require('gulp-autoprefixer');
const pretty = require('prettysize');
// const reload = require('ync.reload);
const rev = require('gulp-rev');
//const sass = require('gulp-sass'));
const size = require('gulp-size');
const sourcemaps = require('gulp-sourcemaps');
const webpack = require('webpack');
const WebpackDevServer = require('webpack-dev-server');

// const internal modules
const config = require('./config.js');
const webpackProdConfig = require('./webpack.config.js');
const webpackDevConfig = require('./webpack.dev.config.js');

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
        ['@babel/preset-env', { targets: "defaults" }],
        // ['@linaria'],
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
  return gulp.src(`build/static/*.js`)
    .pipe(rev())
    .pipe(gulp.dest(`build/static`))
    .pipe(rev.manifest())
    .pipe(gulp.dest(`build/static`));
}

/**
 * Clean out build folder so we build from scratch.
 */
function clean() {
  return del(['build']);
}
exports.clean = clean;

/**
 * Task to compile our files for production.
 */
exports.compile = gulp.series(
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
exports.compileNoLint = gulp.series(
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
exports.watch = gulp.series(
  clean,
  // buildLint,
  gulp.parallel(
    buildClient,
    buildServer,
  ),
  function startServer(callback) {
    // Watch files
    gulp.watch('./app/**/**/**/**/*.js', buildClient);
    gulp.watch('./app/**/**/**/**/*.js', buildServer);
    // gulp.watch('./app/**/**/**/**/*.js', buildLint);

    // Launch Nodemon
    nodemon({
      env: { NODE_ENV: 'development' },
      watch: [ 'build' ],
      ignore: [ 'build/static/' ],
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


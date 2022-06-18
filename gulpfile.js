'use strict'; // eslint-disable-line strict

// Import external modules
import babel from 'gulp-babel';
import browserSync from 'browser-sync';
import cache from 'gulp-cached';
import del from 'del';
import eslint from 'gulp-eslint';
import fs from 'fs';
import gulp from 'gulp';
import gutil from 'gulp-util';
import minifyCss from 'gulp-minify-css';
import nodemon from 'nodemon';
import path from 'path';
import plumber from 'gulp-plumber';
import prefix from 'gulp-autoprefixer';
import pretty from 'prettysize';
// import reload from 'ync.reload;
import rev from 'gulp-rev';
//import sass from 'gulp-sass');
import size from 'gulp-size';
import sourcemaps from 'gulp-sourcemaps';
import webpack from 'webpack';
import WebpackDevServer from 'webpack-dev-server';

// Import internal modules
import config from './config.js';
import webpackProdConfig from './webpack.config.js';
import webpackDevConfig from './webpack.dev.config.js';

// Create an instance of the client compiler for caching
const webpackDevCompiler = webpack(webpackDevConfig);

// Boolean for whether we're running webpack-dev-server
let isRunningDevServer = false;

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
 * Compile our server files.
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
     }))
    .pipe(sourcemaps.write())
    .pipe(size({ title: 'Server JS' }))
    .pipe(gulp.dest('build'));
}

/**
 * Compile our JS files for development and launch webpack-dev-server.
 */
function buildClient(callback) {
  // Run webpack
  webpackDevCompiler.run(err => {
    if (err) throw new gutil.PluginError('build:client', err);

    // Emulate gulp-size and ignore errors
    try {
      let outputConfig = webpackDevConfig.output;
      let jsFilePath = path.join(outputConfig.path, outputConfig.filename);
      gutil.log(`${gutil.colors.cyan('Client JS')} ${gutil.colors.green('all files ')}` +
                `${gutil.colors.magenta(pretty(fs.statSync(jsFilePath).size))}`);
    } catch (e) {}

    // Set boolean to true if we're not running the server.
    if (!isRunningDevServer) {
      isRunningDevServer = true;

      // Start the dev server. We have to make sure we send a new instance of the webpack compiler.
      let devServer = new WebpackDevServer(webpack(webpackDevConfig), webpackDevConfig.devServer);
      devServer.listen(config.ports.webpack, 'localhost', serverErr => {
        if (serverErr) throw new gutil.PluginError('webpack-dev-server', serverErr);
      });
    }

    callback();
  });
}

/**
 * Compile our JS files for production.
 */
function buildClientProd(callback) {
  let webpackProdCompiler = webpack(webpackProdConfig);

  // Run webpack
  webpackProdCompiler.run(err => {
    if (err) throw new gutil.PluginError('build:client:prod', err);

    // Emulate gulp-size
    let outputConfig = webpackProdConfig.output;
    let jsFilePath = path.join(outputConfig.path, outputConfig.filename);
    gutil.log(`${gutil.colors.cyan('Client Prod JS')} ${gutil.colors.green('all files ')}` +
              `${gutil.colors.magenta(pretty(fs.statSync(jsFilePath).size))}`);

    callback();
  });
}

/**
 * Duplicate our CSS and JS files with hashes append to their names, so we can enable long term
 * caching.
 */
function buildCache() {
  return gulp.src(`build/static/js/*.js`)
    .pipe(rev())
    .pipe(gulp.dest(`build/static/js`));
}

/**
 * Clean out build folder so we are sure we're not building from some cache.
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
    gulp.watch('./app/**/**/**/**/*.js', buildClient);
    gulp.watch('./app/**/**/**/*.js', buildServer);
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



'use strict'; // eslint-disable-line strict

import cloneDeep from 'lodash.clonedeep';
import ReactRefreshWebpackPlugin from '@pmmmwh/react-refresh-webpack-plugin';
import webpack from 'webpack';

import webpackProdConfig from './webpack.config.js';
import { PORT_WEBPACK } from './ports.js';

const webpackConfig = cloneDeep(webpackProdConfig);


class WebpackWatchRunPlugin {
  constructor(options) {
    if (typeof options !== "object") options = {};
    this.options = options;
  }

  apply(compiler) {
    const options = this.options;
    compiler.plugin(
      "watch-run",
      function (watching, done) {
        const changedTimes = watching.compiler.watchFileSystem.watcher.mtimes;
        const changedFiles = Object.keys(changedTimes)
        .map(file => `\n  ${file}`)
        .join("");
        if (changedFiles.length) {
          console.log("Files modified:", changedFiles);
        }
        done();
      }
    );
  }
}



webpackConfig.mode = 'development';
webpackConfig.output.publicPath = `http://localhost:${PORT_WEBPACK}/`;
webpackConfig.devServer = {
  compress: true,
  static: {
    directory: './build/static',
  },
  hot: true,
  port: PORT_WEBPACK,
};

// Use React Refresh plugins for Babel and Webpack
webpackConfig.module.rules[0].use[0].options.plugins.unshift('react-refresh/babel');
webpackConfig.plugins.unshift(
  new WebpackWatchRunPlugin(),
  new webpack.HotModuleReplacementPlugin(),
  new ReactRefreshWebpackPlugin(),
);

// CSS sourcemaps
// webpackConfig.module.rules[0].use[1].options.sourceMap = true;
webpackConfig.module.rules[1].use[1].options.sourceMap = true;

// Make sure we don't clobber our other configuration.
export default webpackConfig;


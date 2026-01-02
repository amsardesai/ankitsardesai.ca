'use strict'; // eslint-disable-line strict

import ReactRefreshWebpackPlugin from '@pmmmwh/react-refresh-webpack-plugin';
import cloneDeep from 'lodash.clonedeep';
import webpack from 'webpack';

import { PORT_WEBPACK } from './ports.js';
import webpackProdConfig from './webpack.config.js';

const config = cloneDeep(webpackProdConfig);

class WebpackWatchRunPlugin {
  apply(compiler) {
    compiler.hooks.watchRun.tap('WatchRun', comp => {
      console.log('modified files:', comp.modifiedFiles);
    });
  }
}

config.mode = 'development';
config.output.publicPath = `http://localhost:${PORT_WEBPACK}/`;

config.devServer = {
  compress: true,
  hot: true,
  port: PORT_WEBPACK,
  static: {
    directory: './build/static',
  },
};

// config.cache = {
// type: 'filesystem',
// store: 'pack',
// };

config.watchOptions = {
  aggregateTimeout: 1000,
};

// Use React Refresh plugins for Babel and Webpack
// Note: babel-loader is now at index 0 after removing Style9Plugin.loader
config.module.rules[0].use[0].options.plugins.unshift('react-refresh/babel');
// config.module.rules[1].use[0].loader = 'style-loader';
config.plugins.unshift(
  new WebpackWatchRunPlugin(),
  new webpack.HotModuleReplacementPlugin(),
  new ReactRefreshWebpackPlugin(),
);

// CSS sourcemaps
// config.module.rules[0].use[1].options.sourceMap = true;
// config.module.rules[1].use[1].options.sourceMap = true;

// Make sure we don't clobber our other configuration.
export default config;

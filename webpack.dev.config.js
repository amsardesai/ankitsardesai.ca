
'use strict'; // eslint-disable-line strict

import cloneDeep from 'lodash.clonedeep';
import ReactRefreshWebpackPlugin from '@pmmmwh/react-refresh-webpack-plugin';
import webpack from 'webpack';

import webpackProdConfig from './webpack.config.js';
import { PORT_WEBPACK } from './ports.js';

const config = cloneDeep(webpackProdConfig);


class WebpackWatchRunPlugin {
  apply(compiler) {
    compiler.hooks.watchRun.tap('WatchRun', (comp) => {
      console.log('modified files:', comp.modifiedFiles)
    });
  }
}


config.mode = 'development';
config.output.publicPath = `http://localhost:${PORT_WEBPACK}/`;

config.devServer = {
  compress: true,
  static: {
    directory: './build/static',
  },
  hot: true,
  port: PORT_WEBPACK,
};

// config.cache = {
  // type: 'filesystem',
  // store: 'pack',
// };

config.watchOptions = {
  aggregateTimeout: 1000,
};

// Use React Refresh plugins for Babel and Webpack
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


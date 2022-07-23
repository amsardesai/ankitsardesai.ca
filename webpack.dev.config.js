
'use strict'; // eslint-disable-line strict

import cloneDeep from 'lodash.clonedeep';
import ReactRefreshWebpackPlugin from '@pmmmwh/react-refresh-webpack-plugin';
import webpack from 'webpack';

import webpackProdConfig from './webpack.config.js';
import config from './config.js';

const webpackConfig = cloneDeep(webpackProdConfig);

webpackConfig.mode = 'development';
webpackConfig.output.publicPath = `http://localhost:${config.ports.webpack}/`;
webpackConfig.devServer = {
  compress: true,
  static: {
    directory: './build/static',
  },
  hot: true,
  port: config.ports.webpack,
};

// Use React Refresh plugins for Babel and Webpack
webpackConfig.module.rules[0].use[0].options.plugins.unshift('react-refresh/babel');
webpackConfig.plugins.unshift(
  // new WebpackWatchRunPlugin(),
  new webpack.HotModuleReplacementPlugin(),
  new ReactRefreshWebpackPlugin(),
);

// CSS sourcemaps
// webpackConfig.module.rules[0].use[1].options.sourceMap = true;
webpackConfig.module.rules[1].use[1].options.sourceMap = true;

// Make sure we don't clobber our other configuration.
export default webpackConfig;



'use strict'; // eslint-disable-line strict

const cloneDeep = require('lodash.cloneDeep');
const ReactRefreshWebpackPlugin = require('@pmmmwh/react-refresh-webpack-plugin');
const webpack = require('webpack');

const webpackProdConfig = require('./webpack.config.js');
const config = require('./config.js');

const webpackConfig = cloneDeep(webpackProdConfig);

webpackConfig.mode = 'development';
webpackConfig.output.publicPath = `http://localhost:${config.ports.webpack}/`;
webpackConfig.devServer = {
  static: {
    directory: './build/static',
  },
  hot: true,
  port: config.ports.webpack,
};

// Use React Refresh plugins for Babel and Webpack
webpackConfig.module.rules[0].use[0].options.plugins.unshift('react-refresh/babel');
webpackConfig.plugins.unshift(
  new webpack.DefinePlugin({
    // 'process.env': { NODE_ENV: JSON.stringify('production') },
    IS_CLIENT: true,
    IS_SERVER: false,
  }),
  new webpack.HotModuleReplacementPlugin(),
  new ReactRefreshWebpackPlugin(),
);

// CSS sourcemaps
// webpackConfig.module.rules[0].use[1].options.sourceMap = true;
// webpackConfig.module.rules[1].use[1].options.sourceMap = true;

// Make sure we don't clobber our other configuration.
module.exports = webpackConfig;

// webpackConfig.debug = true;
// webpackConfig.devtool = 'eval-source-map';

// webpackConfig.plugins = [
    // new webpack.DefinePlugin({
      // 'process.env': { NODE_ENV: JSON.stringify('production') },
      // IS_CLIENT: true,
      // IS_SERVER: false,
    // }),
    // new webpack.HotModuleReplacementPlugin(),
    // //new webpack.NoErrorsPlugin(),
// ];

// webpackConfig.devServer = {
    // publicPath: `http://localhost:${config.ports.webpack}/js/`,
    // contentBase: path.join(__dirname, config.files.staticAssets),
    // hot: true,
    // inline: true,
    // silent: true,
    // noInfo: true,
    // headers: { 'Access-Control-Allow-Origin': '*' },
    // stats: { colors: true },
// };

// webpackConfig.output.publicPath =
  // `http://localhost:${config.ports.webpack}/js/`;
// webpackConfig.output.hotUpdateMainFilename = 'update/[hash]/update.json';
// webpackConfig.output.hotUpdateChunkFilename = 'update/[hash]/[id].update.js';

// // Add entry points
// webpackConfig.entry.unshift(
  // `webpack-dev-server/client?http://localhost:${config.ports.webpack}`,
  // 'webpack/hot/only-dev-server'
// );

// // Modify JS loader so that react-hot works
// webpackConfig.module.loaders[0].loaders.unshift('react-hot');


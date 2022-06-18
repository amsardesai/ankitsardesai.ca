
'use strict'; // eslint-disable-line strict

// Import modules
import _ from 'lodash';
import path from 'path';
// import webpack from 'webpack';

// Import production webpack configuration
import webpackProdConfig from './webpack.config.js';

// Import config
// let config = require('./config');

const prodConfig = _.cloneDeep(webpackProdConfig);

// Make sure we don't clobber our other configuration.
export default {
  ...prodConfig,

  mode: 'development',


}

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

// // Update output information
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


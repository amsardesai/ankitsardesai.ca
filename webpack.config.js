
'use strict'; // eslint-disable-line strict

// Import modules
// import webpack from 'webpack';
import { dirname, join } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));

export default {

  // target: 'web',
  // cache: true,
  // context: __dirname,
  // devtool: 'none',
  // debug: false,
  entry: './app/client.js',
  mode: 'production',

  output: {
    path: join(__dirname, 'build/static/js'),
    filename: 'bundle.js',
    // chunkFilename: '[name].[id].js',
    // publicPath: '/assets/js/',
  },

  module: {
    rules: [
      {
        test: /\.jsx?$/,
        exclude: /node_modules/,
        use: {
          loader: 'babel-loader',
          options: {
            presets: [
              ['@babel/preset-typescript', { isTSX: true, allExtensions: true }],
              ['@babel/preset-react'],
              ['@babel/preset-env', { targets: "defaults" }],
            ],
          },
        },
      },
    ],
  },

  // externals: {
    // 'source-map-support': null,
  // },

  // plugins: [
    // new webpack.DefinePlugin({
      // 'process.env': { NODE_ENV: JSON.stringify('production') },
      // IS_CLIENT: true,
      // IS_SERVER: false,
    // }),
    //new webpack.optimize.DedupePlugin(),
    //new webpack.optimize.OccurenceOrderPlugin(),
    //new webpack.optimize.UglifyJsPlugin(),
  // ],

  // babel: {
    // presets: ['es2015', 'react', 'stage-0'],
    // plugins: ['transform-decorators-legacy'],
  // },

  // module: {
    // loaders: [
      // {
        // test: /\.jsx?$/,
        // loaders: ['babel'],
        // include: [path.resolve(__dirname, 'app')],
      // },
    // ],
  // },

  // node: {
    // fs: 'empty',
    // buffer: 'empty',
    // util: 'empty',
    // events: 'empty',
    // assert: 'empty',
  // },

  // resolve: {
    // extensions: ['', '.jsx', '.js'],
  // },

};



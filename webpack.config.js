
'use strict'; // eslint-disable-line strict

const Style9Plugin = require('style9/webpack');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const webpack = require('webpack');
const { join } = require('path');

const config = require('./config.js');

module.exports = {

  // target: 'web',
  // cache: true,
  // context: __dirname,
  // devtool: 'none',
  // debug: false,
  entry: './app/client.js',
  mode: 'production',

  output: {
    path: join(__dirname, 'build/static'),
    filename: 'bundle.js',
    chunkFilename: '[name].[id].js',
    publicPath: '/assets/',
  },

  module: {
    rules: [
      {
        test: /\.jsx?$/,
        exclude: /node_modules/,
        use: [
          {
            loader: 'babel-loader',
            options: {
              presets: [
                ['@babel/preset-typescript', { isTSX: true, allExtensions: true }],
                ['@babel/preset-react'],
                ['@babel/preset-env', { targets: "defaults" }],
              ],
              plugins: [
                ['style9/babel']
              ],
            },
          },
          // { loader: Style9Plugin.loader },
        ],
      },
      {
        test: /\.css$/,
        use: [
          { loader: MiniCssExtractPlugin.loader },
          { loader: 'css-loader', options: {} },
        ],
      },
    ],
  },

  plugins: [
    new Style9Plugin(),
    new MiniCssExtractPlugin(),
  ],

  optimization: {
    splitChunks: {
      cacheGroups: {
        styles: {
          name: 'styles',
          type: 'css/mini-extract',
          chunks: 'all',
          enforce: true,
        }
      }
    }
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



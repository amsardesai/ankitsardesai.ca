
'use strict'; // eslint-disable-line strict

import Style9Plugin from 'style9/webpack/index.js';
import MiniCssExtractPlugin from 'mini-css-extract-plugin';
import CssMinimizerPlugin from 'css-minimizer-webpack-plugin';
import webpack from 'webpack';
import { dirname, join } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));

export default {

  entry: './app/client.js',
  mode: 'production',

  output: {
    path: join(__dirname, 'build/static'),
    filename: 'bundle.js',
    publicPath: '/assets/',
  },

  module: {
    rules: [
      {
        test: /\.(j|t)sx?$/,
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
              plugins: [],
            },
          },
          { loader: Style9Plugin.loader },
        ],
      },
      {
        test: /\.css$/,
        use: [
          { loader: MiniCssExtractPlugin.loader },
          {
            loader: 'css-loader',
            options: { sourceMap: false },
          },
        ],
      },
    ],
  },

  plugins: [
    new Style9Plugin(),
    new MiniCssExtractPlugin({
      filename: 'styles.css',
    }),
  ],

  optimization: {
    innerGraph: true,
    mangleExports: true,
    minimizer: [ '...', new CssMinimizerPlugin() ],
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

};



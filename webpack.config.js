'use strict'; // eslint-disable-line strict

import CssMinimizerPlugin from 'css-minimizer-webpack-plugin';
import MiniCssExtractPlugin from 'mini-css-extract-plugin';
import { dirname, join } from 'path';
import ResolveTypeScriptPlugin from 'resolve-typescript-plugin';
import Style9Plugin from 'style9/webpack/index.js';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));

export default {
  entry: './app/client.tsx',
  mode: 'production',

  module: {
    rules: [
      {
        exclude: /node_modules/,
        test: /\.tsx?$/,
        use: [
          { loader: Style9Plugin.loader },
          {
            loader: 'babel-loader',
            options: {
              plugins: [],
              presets: [['@babel/preset-env', { targets: 'defaults' }]],
            },
          },
          { loader: 'ts-loader' },
        ],
      },
      {
        test: /\.css$/,
        use: [
          { loader: MiniCssExtractPlugin.loader },
          { loader: 'css-loader', options: { importLoaders: 1 } },
          {
            loader: 'postcss-loader',
            options: {
              postcssOptions: {
                plugins: [['postcss-preset-env']],
              },
            },
          },
        ],
      },
    ],
  },

  optimization: {
    innerGraph: true,
    mangleExports: true,
    minimizer: ['...', new CssMinimizerPlugin()],
    splitChunks: {
      cacheGroups: {
        styles: {
          chunks: 'all',
          enforce: true,
          name: 'styles',
          type: 'css/mini-extract',
        },
      },
    },
  },

  output: {
    filename: 'bundle.js',
    path: join(__dirname, 'build/static'),
    publicPath: '/assets/',
  },

  plugins: [
    new Style9Plugin(),
    new MiniCssExtractPlugin({
      filename: 'styles.css',
    }),
  ],

  resolve: {
    plugins: [new ResolveTypeScriptPlugin()],
  },
};


'use strict'; // eslint-disable-line strict

import cloneDeep from 'lodash.cloneDeep';
import ReactRefreshWebpackPlugin from '@pmmmwh/react-refresh-webpack-plugin';
import webpack from 'webpack';

import webpackProdConfig from './webpack.config.js';
import config from './config.js';

const webpackConfig = cloneDeep(webpackProdConfig);



// class WebpackWatchRunPlugin {
    // constructor(options) {
        // if (typeof options !== "object") options = {};
        // this.options = options;
    // }

    // apply(compiler) {
        // const options = this.options;
        // compiler.plugin("watch-run",
            // function (watching, done) {
                // const changedTimes = watching.compiler.watchFileSystem.watcher.mtimes;
                // const changedFiles = Object.keys(changedTimes)
                    // .map(file => `\n  ${file}`)
                    // .join("");
                // if (changedFiles.length) {
                    // console.log("Files modified:", changedFiles);
                // }
                // done();
            // });
    // }
// }



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


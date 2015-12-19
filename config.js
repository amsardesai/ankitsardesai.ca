
module.exports = {

  ports: {
    webpack: 8080,
    koa: 5092,
  },

  files: {
    client: {
      entry: './app/client.jsx',
      src: ['./app/**/**/**/**/*.js', './app/**/**/**/**/*.jsx'],
      out: 'js',
      outFile: 'bundle.js',
    },
    css: {
      entry: './assets/css/main.sass',
      src: './assets/css/**/**/*.sass',
      out: 'css',
    },
    images: {
      src: './assets/images/*',
      out: 'img',
    },
    server: {
      src: ['./app/**/**/**/*.js', './app/**/**/**/*.jsx'],
      out: 'build',
    },
    staticAssets: 'build/static/',
  },

  build: {
    babel: {
      presets: ['node5', 'react', 'stage-0'],
    },
    sass: {
      style: 'compact',
      includePaths: ['./assets/css', './node_modules'],
    },
    autoprefixer: {
      browsers: ['> 5%'],
    },
  },

};


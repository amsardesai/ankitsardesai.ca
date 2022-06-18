
export default {

  ports: {
    webpack: 8080,
    koa: 5092,
  },

  files: {
    client: {
      entry: './app/client.js',
      src: './app/**/**/**/**/*.js',
      out: 'js',
      outFile: 'bundle.js',
    },
    css: {
      entry: './assets/css/master.sass',
      src: './assets/css/**/**/*.sass',
      out: 'css',
    },
    images: {
      src: './assets/images/*',
      out: 'img',
    },
    server: {
      src: './app/**/**/**/*.js',
      out: 'build',
    },
    staticAssets: 'build/static/',
  },

  build: {
    babel: {
      client: {
        presets: ['es2015', 'react', 'stage-0'],
        plugins: ['transform-decorators-legacy'],
      },
      server: {
        presets: ['node6', 'react', 'stage-0'],
        plugins: ['transform-decorators-legacy'],
      },
    },
    sass: {
      style: 'compact',
      includePaths: ['./assets/css', './node_modules'],
    },
    autoprefixer: {
      browsers: ['> 5%'],
    },
  },

  analytics: {
    google: 'UA-37589348-3',
  },

};


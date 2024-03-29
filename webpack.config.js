const path = require('path');
const PATHS = {
  app: path.resolve(__dirname,'frontend'),
  vendor: path.resolve(__dirname,'vendor'),
  build: path.resolve(__dirname,'build/frontend')
};
module.exports = {
  entry: {
    app: [ PATHS.app + "/index.js",
           PATHS.vendor + "/latinise.min.js"]
  },
  output: {
    path: PATHS.build,
    filename: 'bundle.js'
  },
  resolve: {
    alias: {
      'vue': 'vue/dist/vue.esm-browser.prod.js'
    }
  },
  mode: 'production',
  optimization: {
    nodeEnv: 'production',
    minimize: true
  }
};

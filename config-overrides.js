const path = require('path');

module.exports = function (config, env) {
  config.resolve = {
    ...config.resolve,
    alias: {
      ...config.resolve.alias,
      normandy: path.resolve(__dirname, './src/normandy/')
    }
  }

  return config;
}
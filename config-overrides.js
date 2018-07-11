const { execSync } = require('child_process');
const GenerateJSONWebpackPlugin = require('generate-json-webpack-plugin');
const path = require('path');
const process = require('process');
const { injectBabelPlugin } = require('react-app-rewired');
const rewireLess = require('react-app-rewire-less');

const packageData = require('./package.json');

function generateVersionObject() {
  const commit = execSync('git rev-parse --verify HEAD')
    .toString('utf-8')
    .trim();

  let version = '';

  // Look for a tag
  try {
    version = execSync('git describe --exact-match --tags 2>/dev/null')
      .toString('utf-8')
      .trim();
  } catch (err) {
    // Do nothing.
  }

  return {
    source: packageData.repository.url,
    build: process.env.BUILD_URL || process.env.CIRCLE_BUILD_URL || '',
    commit,
    version,
  };
}

module.exports = function(config, env) {
  config.resolve = {
    ...config.resolve,
    alias: {
      ...config.resolve.alias,
      console: path.resolve(__dirname, './src/'),
    },
  };

  config.plugins.push(new GenerateJSONWebpackPlugin('__version__', generateVersionObject()));

  // LESS support
  config = rewireLess.withLoaderOptions({
    javascriptEnabled: true,
  })(config, env);
  // Use Ant LESS imports
  config = injectBabelPlugin(['import', { libraryName: 'antd', style: true }], config);
  // Decorator support (Normandy)
  config = injectBabelPlugin('transform-decorators-legacy', config);

  return config;
};

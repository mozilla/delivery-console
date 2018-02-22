const path = require("path");
const { injectBabelPlugin } = require("react-app-rewired");
const rewireLess = require("react-app-rewire-less");

module.exports = function(config, env) {
  config.resolve = {
    ...config.resolve,
    alias: {
      ...config.resolve.alias,
      normandy: path.resolve(__dirname, "./src/normandy/")
    }
  };

  // LESS support
  config = rewireLess(config, env);
  // Legacy decorator support
  config = injectBabelPlugin("transform-decorators-legacy", config);
  // Use Ant LESS imports
  config = injectBabelPlugin(
    ["import", { libraryName: "antd", style: true }],
    config
  );

  return config;
};

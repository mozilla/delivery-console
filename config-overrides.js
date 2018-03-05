const path = require("path");
const { injectBabelPlugin } = require("react-app-rewired");
const rewireLess = require("react-app-rewire-less");

module.exports = function(config, env) {
  config.resolve = {
    ...config.resolve,
    alias: {
      ...config.resolve.alias,
      console: path.resolve(__dirname, "./src/console/"),
    }
  };

  // LESS support
  config = rewireLess(config, env);
  // Use Ant LESS imports
  config = injectBabelPlugin(
    ["import", { libraryName: "antd", style: true }],
    config
  );

  return config;
};

const path = require("path");
const { injectBabelPlugin } = require("react-app-rewired");
const rewireLess = require("react-app-rewire-less");

module.exports = function(config, env) {
  config.resolve = {
    ...config.resolve,
    alias: {
      ...config.resolve.alias,
      console: path.resolve(__dirname, "./src/console/"),
      normandy: path.resolve(__dirname, "./src/normandy/"),
    }
  };

  // LESS support
  config = rewireLess(config, env);
  // Use Ant LESS imports
  config = injectBabelPlugin(
    ["import", { libraryName: "antd", style: true }],
    config
  );

  // If an --app=something parameter is present when running this script,
  // change the entry point to start the given app.
  let selectedApp = process.argv.find(val => val.startsWith('--app'));
  if(selectedApp) {
    selectedApp = selectedApp.split('=')[1];
    config.entry = path.resolve(__dirname, `./src/${selectedApp}/index.js`);
  }

  return config;
};

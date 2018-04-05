/* eslint-env node */
/* eslint-disable no-var, func-names, prefer-arrow-callback, prefer-template */

// Karma configuration


const WEBPACK_CONFIG_BASE = require('./node_modules/react-scripts/config/webpack.config.dev.js');

const configOverride = require('./config-overrides.js');
const WEBPACK_CONFIG = configOverride(WEBPACK_CONFIG_BASE);

module.exports = function (config) {
  var karmaConfig = {
    // base path that will be used to resolve all patterns (eg. files, exclude)
    basePath: '',

    // frameworks to use
    // available frameworks: https://npmjs.org/browse/keyword/karma-adapter
    frameworks: ['jasmine'],

    // list of files / patterns to load in the browser
    files: [
      'node_modules/babel-polyfill/dist/polyfill.js',
      'node_modules/jasmine-promises/dist/jasmine-promises.js',
      'src/**/tests/index.js',
    ],

    plugins: [
      'karma-jasmine',
      'karma-webpack',
      'karma-spec-reporter',
      'karma-sourcemap-loader',
      'karma-firefox-launcher'
    ],

    // preprocess matching files before serving them to the browser
    // available preprocessors: https://npmjs.org/browse/keyword/karma-preprocessor
    preprocessors: {
      'src/**/*.js': ['webpack', 'sourcemap'],
    },

    webpack: Object.assign(WEBPACK_CONFIG, {
      entry: undefined,
      devtool: undefined,
    }),

    webpackMiddleware: {
      stats: 'errors-only', // Only show errors during webpack builds.
    },

    // test results reporter to use
    // possible values: 'dots', 'progress'
    // available reporters: https://npmjs.org/browse/keyword/karma-reporter
    reporters: ['spec'],

    // web server port
    port: 9876,

    // enable / disable colors in the output (reporters and logs)
    colors: true,

    // possible values: config.LOG_DISABLE, config.LOG_ERROR, config.LOG_WARN,
    // config.LOG_INFO, or config.LOG_DEBUG.
    logLevel: config.LOG_INFO,

    // enable / disable watching file and executing tests whenever any file changes
    autoWatch: true,

    // start these browsers
    // available browser launchers: https://npmjs.org/browse/keyword/karma-launcher
    browsers: ['FirefoxHeadless'],
    customLaunchers: {
      FirefoxHeadless: {
        base: 'Firefox',
        flags: [ '--headless' ],
      },
    },

    // Continuous Integration mode
    // if true, Karma captures browsers, runs the tests and exits
    singleRun: !!process.env.CI ? process.env.CI : true,

    // Concurrency level
    // how many browser should be started simultaneous
    concurrency: Infinity,
  };

  config.set(karmaConfig);
};

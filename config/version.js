const { execSync } = require('child_process');
const paths = require('./paths');

const packageData = require(paths.appPackageJson);

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

module.exports = generateVersionObject;

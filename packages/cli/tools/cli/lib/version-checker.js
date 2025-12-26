/**
 * AgileFlow CLI - Version Checker
 *
 * Checks for updates from npm registry.
 */

const https = require('node:https');
const semver = require('semver');
const path = require('node:path');

// Load package.json for current version
const packageJsonPath = path.join(__dirname, '..', '..', '..', 'package.json');
const packageJson = require(packageJsonPath);

/**
 * Get the latest version from npm registry
 * @param {string} packageName - Package name
 * @returns {Promise<string|null>} Latest version or null
 */
async function getLatestVersion(packageName = 'agileflow') {
  return new Promise(resolve => {
    const url = `https://registry.npmjs.org/${packageName}/latest`;

    const req = https.get(url, { timeout: 5000 }, res => {
      if (res.statusCode !== 200) {
        resolve(null);
        return;
      }

      let data = '';
      res.on('data', chunk => {
        data += chunk;
      });

      res.on('end', () => {
        try {
          const json = JSON.parse(data);
          resolve(json.version || null);
        } catch {
          resolve(null);
        }
      });
    });

    req.on('error', () => {
      resolve(null);
    });

    req.on('timeout', () => {
      req.destroy();
      resolve(null);
    });
  });
}

/**
 * Check if an update is available
 * @returns {Promise<Object>} Update info
 */
async function checkForUpdate() {
  const currentVersion = packageJson.version;
  const latestVersion = await getLatestVersion();

  if (!latestVersion) {
    return {
      current: currentVersion,
      latest: null,
      updateAvailable: false,
      error: 'Could not check for updates',
    };
  }

  const updateAvailable = semver.gt(latestVersion, currentVersion);

  return {
    current: currentVersion,
    latest: latestVersion,
    updateAvailable,
    error: null,
  };
}

/**
 * Get current version
 * @returns {string}
 */
function getCurrentVersion() {
  return packageJson.version;
}

module.exports = {
  getLatestVersion,
  checkForUpdate,
  getCurrentVersion,
};

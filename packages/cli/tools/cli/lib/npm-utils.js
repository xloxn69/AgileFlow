/**
 * AgileFlow CLI - npm Registry Utilities
 *
 * Utilities for interacting with the npm registry.
 */

const https = require('https');

/**
 * Get the latest version of a package from npm registry
 * @param {string} packageName - Name of the package
 * @returns {Promise<string|null>} Latest version or null if error
 */
async function getLatestVersion(packageName) {
  return new Promise((resolve) => {
    const options = {
      hostname: 'registry.npmjs.org',
      port: 443,
      path: `/${packageName}/latest`,
      method: 'GET',
      headers: {
        'User-Agent': 'agileflow-cli',
      },
    };

    const req = https.request(options, (res) => {
      let data = '';

      res.on('data', (chunk) => {
        data += chunk;
      });

      res.on('end', () => {
        try {
          if (res.statusCode === 200) {
            const json = JSON.parse(data);
            resolve(json.version || null);
          } else {
            resolve(null);
          }
        } catch (err) {
          resolve(null);
        }
      });
    });

    req.on('error', () => {
      resolve(null);
    });

    req.setTimeout(5000, () => {
      req.destroy();
      resolve(null);
    });

    req.end();
  });
}

module.exports = {
  getLatestVersion,
};

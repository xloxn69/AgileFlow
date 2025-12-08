/**
 * AgileFlow CLI - Update Command
 *
 * Updates an existing AgileFlow installation.
 */

const chalk = require('chalk');
const path = require('node:path');
const { Installer } = require('../installers/core/installer');
const { IdeManager } = require('../installers/ide/manager');
const { displayLogo, displaySection, success, warning, error, info, confirm } = require('../lib/ui');

const installer = new Installer();
const ideManager = new IdeManager();

module.exports = {
  name: 'update',
  description: 'Update existing AgileFlow installation',
  options: [
    ['-d, --directory <path>', 'Project directory (default: current directory)'],
    ['--force', 'Force update, overwriting modified files'],
  ],
  action: async (options) => {
    try {
      const directory = path.resolve(options.directory || '.');

      displayLogo();

      // Check for existing installation
      const status = await installer.getStatus(directory);

      if (!status.installed) {
        warning('No AgileFlow installation found');
        console.log(chalk.dim(`\nRun 'npx agileflow install' to set up AgileFlow\n`));
        process.exit(1);
      }

      displaySection('Updating AgileFlow', `Current version: ${status.version}`);

      // Get package version
      const packageJson = require(path.join(__dirname, '..', '..', '..', 'package.json'));
      const newVersion = packageJson.version;

      console.log(chalk.bold('Current: '), status.version);
      console.log(chalk.bold('Latest:  '), newVersion);

      if (status.version === newVersion && !options.force) {
        success('Already on the latest version');
        process.exit(0);
      }

      // Confirm update
      if (!options.force) {
        const proceed = await confirm(`Update to v${newVersion}?`);
        if (!proceed) {
          console.log(chalk.dim('\nUpdate cancelled\n'));
          process.exit(0);
        }
      }

      console.log();

      // Re-run installation with existing config
      const config = {
        directory,
        ides: status.ides || ['claude-code'],
        userName: 'Developer', // Could read from existing config
        agileflowFolder: path.basename(status.path),
      };

      // Run core installation
      const coreResult = await installer.install(config);

      if (!coreResult.success) {
        error('Update failed');
        process.exit(1);
      }

      success('Updated core content');

      // Re-setup IDEs
      ideManager.setAgileflowFolder(config.agileflowFolder);

      for (const ide of config.ides) {
        await ideManager.setup(ide, directory, status.path);
      }

      console.log(chalk.green(`\n✨ Update complete! (${status.version} → ${newVersion})\n`));

      process.exit(0);
    } catch (err) {
      console.error(chalk.red('Update failed:'), err.message);
      if (process.env.DEBUG) {
        console.error(err.stack);
      }
      process.exit(1);
    }
  },
};

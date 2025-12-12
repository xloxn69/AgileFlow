/**
 * AgileFlow CLI - Status Command
 *
 * Shows installation status for the current project.
 */

const chalk = require('chalk');
const path = require('node:path');
const fs = require('fs-extra');
const ora = require('ora');
const { Installer } = require('../installers/core/installer');
const { displayLogo, displaySection, success, warning, info } = require('../lib/ui');
const { checkForUpdate } = require('../lib/version-checker');

const installer = new Installer();

module.exports = {
  name: 'status',
  description: 'Show AgileFlow installation status',
  options: [
    ['-d, --directory <path>', 'Project directory (default: current directory)'],
  ],
  action: async (options) => {
    try {
      const directory = path.resolve(options.directory || '.');

      displayLogo();
      displaySection('Installation Status');

      const status = await installer.getStatus(directory);

      if (!status.installed) {
        warning('No AgileFlow installation found in this directory');
        console.log(chalk.dim(`\nRun 'npx agileflow install' to set up AgileFlow\n`));
        process.exit(0);
      }

      // Show installation info
      console.log(chalk.bold('Location:    '), status.path);
      console.log(chalk.bold('Version:     '), status.version);

      // Count installed items
      const counts = await installer.countInstalledItems(status.path);

      console.log(chalk.bold('\nCore:        '), chalk.green('✓ Installed'));
      info(`${counts.agents} agents`);
      info(`${counts.commands} commands`);
      info(`${counts.skills} skills`);

      // Show configured IDEs
      if (status.ides && status.ides.length > 0) {
        console.log(chalk.bold('\nConfigured IDEs:'));
        for (const ide of status.ides) {
          // Check if IDE config exists
          const ideConfigPath = getIdeConfigPath(directory, ide);
          const exists = await fs.pathExists(ideConfigPath);

          if (exists) {
            success(formatIdeName(ide));
          } else {
            warning(`${formatIdeName(ide)} (config missing)`);
          }
        }
      }

      // Check for updates
      const spinner = ora('Checking for updates...').start();
      const updateInfo = await checkForUpdate();
      spinner.stop();

      if (updateInfo.updateAvailable) {
        console.log(chalk.bold('\nUpdate Available:'));
        console.log(chalk.yellow(`  ${updateInfo.current} → ${updateInfo.latest}`));
        console.log(chalk.dim(`  Run 'npx agileflow update' to update\n`));
      } else if (updateInfo.error) {
        console.log(chalk.dim(`\n${updateInfo.error}\n`));
      } else {
        console.log(chalk.green('\n✓ You are on the latest version\n'));
      }

      process.exit(0);
    } catch (err) {
      console.error(chalk.red('Error:'), err.message);
      if (process.env.DEBUG) {
        console.error(err.stack);
      }
      process.exit(1);
    }
  },
};

/**
 * Get IDE config path
 * @param {string} projectDir - Project directory
 * @param {string} ide - IDE name
 * @returns {string}
 */
function getIdeConfigPath(projectDir, ide) {
  const paths = {
    'claude-code': '.claude/commands/AgileFlow',
    'cursor': '.cursor/rules/agileflow',
    'windsurf': '.windsurf/workflows/agileflow',
  };

  return path.join(projectDir, paths[ide] || '');
}

/**
 * Format IDE name for display
 * @param {string} ide - IDE name
 * @returns {string}
 */
function formatIdeName(ide) {
  const names = {
    'claude-code': 'Claude Code',
    'cursor': 'Cursor',
    'windsurf': 'Windsurf',
  };

  return names[ide] || ide;
}

/**
 * AgileFlow CLI - Uninstall Command
 *
 * Removes AgileFlow from a project.
 */

const chalk = require('chalk');
const path = require('node:path');
const fs = require('fs-extra');
const { Installer } = require('../installers/core/installer');
const { IdeManager } = require('../installers/ide/manager');
const { displayLogo, displaySection, success, warning, error, confirm } = require('../lib/ui');

const installer = new Installer();
const ideManager = new IdeManager();

module.exports = {
  name: 'uninstall',
  description: 'Remove AgileFlow from a project',
  options: [
    ['-d, --directory <path>', 'Project directory (default: current directory)'],
    ['--force', 'Skip confirmation prompt'],
  ],
  action: async (options) => {
    try {
      const directory = path.resolve(options.directory || '.');

      displayLogo();

      // Check for existing installation
      const status = await installer.getStatus(directory);

      if (!status.installed) {
        warning('No AgileFlow installation found');
        process.exit(0);
      }

      displaySection('Uninstalling AgileFlow', `Location: ${status.path}`);

      // Confirm uninstall
      if (!options.force) {
        const proceed = await confirm('Are you sure you want to uninstall AgileFlow?', false);
        if (!proceed) {
          console.log(chalk.dim('\nUninstall cancelled\n'));
          process.exit(0);
        }
      }

      console.log();

      // Remove IDE configurations
      if (status.ides && status.ides.length > 0) {
        for (const ide of status.ides) {
          const configPath = getIdeConfigPath(directory, ide);
          if (await fs.pathExists(configPath)) {
            await fs.remove(configPath);
            success(`Removed ${formatIdeName(ide)} configuration`);
          }
        }
      }

      // Remove AgileFlow directory
      if (await fs.pathExists(status.path)) {
        await fs.remove(status.path);
        success(`Removed ${path.basename(status.path)}/`);
      }

      console.log(chalk.green('\nAgileFlow has been uninstalled.\n'));

      process.exit(0);
    } catch (err) {
      console.error(chalk.red('Uninstall failed:'), err.message);
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
    'claude-code': '.claude/commands/agileflow',
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

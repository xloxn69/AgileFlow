/**
 * AgileFlow CLI - Install Command
 *
 * Installs AgileFlow to a project directory.
 */

const chalk = require('chalk');
const path = require('node:path');
const { Installer } = require('../installers/core/installer');
const { IdeManager } = require('../installers/ide/manager');
const { promptInstall, success, error, info, displaySection } = require('../lib/ui');

const installer = new Installer();
const ideManager = new IdeManager();

module.exports = {
  name: 'install',
  description: 'Install AgileFlow to a project',
  options: [
    ['-d, --directory <path>', 'Installation directory (default: current directory)'],
    ['-y, --yes', 'Skip prompts and use defaults'],
  ],
  action: async (options) => {
    try {
      let config;

      if (options.yes) {
        // Use defaults
        config = {
          directory: path.resolve(options.directory || '.'),
          ides: ['claude-code'],
          userName: 'Developer',
          agileflowFolder: '.agileflow',
        };
      } else {
        // Interactive prompts
        config = await promptInstall();
      }

      displaySection('Installing AgileFlow', `Target: ${config.directory}`);

      // Run core installation
      const coreResult = await installer.install(config);

      if (!coreResult.success) {
        error('Core installation failed');
        process.exit(1);
      }

      success(`Installed ${coreResult.counts.agents} agents`);
      success(`Installed ${coreResult.counts.commands} commands`);
      success(`Installed ${coreResult.counts.skills} skills`);

      // Setup IDE configurations
      displaySection('Configuring IDEs');

      ideManager.setAgileflowFolder(config.agileflowFolder);

      for (const ide of config.ides) {
        await ideManager.setup(ide, config.directory, coreResult.path);
      }

      // Final summary
      console.log(chalk.green('\n✨ Installation complete!\n'));

      console.log(chalk.bold('Get started:'));
      info('Open your IDE and use /agileflow:help');
      info(`Run 'npx agileflow status' to check installation`);
      info(`Run 'npx agileflow update' to get updates`);

      console.log(chalk.dim(`\nInstalled to: ${coreResult.path}\n`));

      process.exit(0);
    } catch (err) {
      console.error(chalk.red('\nInstallation failed:'), err.message);
      if (process.env.DEBUG) {
        console.error(err.stack);
      }
      process.exit(1);
    }
  },
};

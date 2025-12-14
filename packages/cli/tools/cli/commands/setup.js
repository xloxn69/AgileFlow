/**
 * AgileFlow CLI - Setup Command
 *
 * Sets up AgileFlow in a project directory.
 */

const chalk = require('chalk');
const path = require('node:path');
const { Installer } = require('../installers/core/installer');
const { IdeManager } = require('../installers/ide/manager');
const { promptInstall, success, error, info, displaySection } = require('../lib/ui');
const { createDocsStructure } = require('../lib/docs-setup');

const installer = new Installer();
const ideManager = new IdeManager();

module.exports = {
  name: 'setup',
  description: 'Set up AgileFlow in a project',
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
          docsFolder: 'docs',
          updateGitignore: true,
        };
      } else {
        // Interactive prompts
        config = await promptInstall();
      }

      displaySection('Setting Up AgileFlow', `Target: ${config.directory}`);

      // Run core installation
      const coreResult = await installer.install(config);

      if (!coreResult.success) {
        error('Core setup failed');
        process.exit(1);
      }

      success(`Installed ${coreResult.counts.agents} agents`);
      success(`Installed ${coreResult.counts.commands} commands`);
      success(`Installed ${coreResult.counts.skills} skills`);

      // Setup IDE configurations
      displaySection('Configuring IDEs');

      ideManager.setAgileflowFolder(config.agileflowFolder);
      ideManager.setDocsFolder(config.docsFolder);

      for (const ide of config.ides) {
        await ideManager.setup(ide, config.directory, coreResult.path);
      }

      // Create docs structure
      displaySection('Creating Documentation Structure', `Folder: ${config.docsFolder}/`);
      const docsResult = await createDocsStructure(config.directory, config.docsFolder, {
        updateGitignore: config.updateGitignore,
      });

      if (!docsResult.success) {
        error('Failed to create docs structure');
        if (docsResult.errors.length > 0) {
          docsResult.errors.forEach((err) => error(`  ${err}`));
        }
      }

      // Final summary
      console.log(chalk.green('\n✨ Setup complete!\n'));

      console.log(chalk.bold('Get started:'));
      info('Open your IDE and use /agileflow:help');
      info(`Run 'npx agileflow status' to check setup`);
      info(`Run 'npx agileflow update' to get updates`);

      console.log(chalk.dim(`\nInstalled to: ${coreResult.path}\n`));

      process.exit(0);
    } catch (err) {
      console.error(chalk.red('\nSetup failed:'), err.message);
      if (process.env.DEBUG) {
        console.error(err.stack);
      }
      process.exit(1);
    }
  },
};

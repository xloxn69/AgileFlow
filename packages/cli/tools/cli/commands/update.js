/**
 * AgileFlow CLI - Update Command
 *
 * Updates an existing AgileFlow installation.
 * Includes self-update capability to always use the latest CLI.
 */

const chalk = require('chalk');
const path = require('node:path');
const { spawnSync } = require('node:child_process');
const semver = require('semver');
const { Installer } = require('../installers/core/installer');
const { IdeManager } = require('../installers/ide/manager');
const {
  displayLogo,
  displaySection,
  success,
  warning,
  error,
  info,
  confirm,
} = require('../lib/ui');
const { createDocsStructure, getDocsFolderName } = require('../lib/docs-setup');
const { getLatestVersion } = require('../lib/npm-utils');

const installer = new Installer();
const ideManager = new IdeManager();

module.exports = {
  name: 'update',
  description: 'Update existing AgileFlow installation',
  options: [
    ['-d, --directory <path>', 'Project directory (default: current directory)'],
    ['--force', 'Force reinstall (skip prompts; overwrites local changes)'],
    ['--no-self-update', 'Skip automatic CLI self-update check'],
    ['--self-updated', 'Internal flag: indicates CLI was already self-updated'],
  ],
  action: async options => {
    try {
      const directory = path.resolve(options.directory || '.');

      displayLogo();

      // Check for existing installation
      const status = await installer.getStatus(directory);

      if (!status.installed) {
        warning('No AgileFlow installation found');
        console.log(chalk.dim(`\nRun 'npx agileflow setup' to set up AgileFlow\n`));
        process.exit(1);
      }

      displaySection('Updating AgileFlow', `Current version: ${status.version}`);

      // Get local CLI version and npm registry version
      const packageJson = require(path.join(__dirname, '..', '..', '..', 'package.json'));
      const localCliVersion = packageJson.version;

      console.log(chalk.dim('Checking npm registry for latest version...'));
      const npmLatestVersion = await getLatestVersion('agileflow');

      if (!npmLatestVersion) {
        warning('Could not check npm registry for latest version');
        console.log(chalk.dim('Continuing with local CLI version...\n'));
      }

      const latestVersion = npmLatestVersion || localCliVersion;

      console.log(chalk.bold('Installed:   '), status.version);
      console.log(chalk.bold('CLI version: '), localCliVersion);
      if (npmLatestVersion) {
        console.log(chalk.bold('Latest (npm):'), npmLatestVersion);
      }

      // Self-update: if CLI is outdated and we haven't already self-updated, re-run with latest
      const shouldSelfUpdate = options.selfUpdate !== false && !options.selfUpdated;
      if (npmLatestVersion && semver.lt(localCliVersion, npmLatestVersion) && shouldSelfUpdate) {
        console.log();
        info(`Updating CLI from v${localCliVersion} to v${npmLatestVersion}...`);
        console.log(chalk.dim('  Fetching latest version from npm...\n'));

        // Build the command with all current options forwarded
        const args = ['agileflow@latest', 'update', '--self-updated'];
        if (options.directory) args.push('-d', options.directory);
        if (options.force) args.push('--force');

        const result = spawnSync('npx', args, {
          stdio: 'inherit',
          cwd: process.cwd(),
          shell: process.platform === 'win32',
        });

        // Exit with the same code as the spawned process
        process.exit(result.status ?? 0);
      }

      // If we self-updated, show confirmation
      if (options.selfUpdated) {
        success(`CLI updated to v${localCliVersion}`);
        console.log();
      }

      // Check if CLI itself is still outdated (only if self-update was disabled)
      if (npmLatestVersion && semver.lt(localCliVersion, npmLatestVersion) && !shouldSelfUpdate) {
        console.log();
        warning('Your CLI is outdated!');
        console.log(chalk.dim(`  To update your installation, run:\n`));
        console.log(chalk.cyan(`  npx agileflow@latest update\n`));

        const useOutdated = options.force
          ? true
          : await confirm('Continue with outdated CLI anyway?');
        if (!useOutdated) {
          console.log(chalk.dim('\nUpdate cancelled\n'));
          process.exit(0);
        }
      }

      // Check if project installation is up to date
      if (status.version === latestVersion && !options.force) {
        success('Already on the latest version');
        process.exit(0);
      }

      // Confirm update
      if (!options.force) {
        const proceed = await confirm(`Update to v${latestVersion}?`);
        if (!proceed) {
          console.log(chalk.dim('\nUpdate cancelled\n'));
          process.exit(0);
        }
      }

      console.log();

      // Get docs folder name from metadata (or default to 'docs')
      const docsFolder = await getDocsFolderName(directory);

      // Re-run installation with existing config from manifest
      const config = {
        directory,
        ides: status.ides || ['claude-code'],
        userName: status.userName || 'Developer',
        agileflowFolder: status.agileflowFolder || path.basename(status.path),
        docsFolder: status.docsFolder || docsFolder,
      };

      // Run core installation
      const coreResult = await installer.install(config, { force: options.force });

      if (!coreResult.success) {
        error('Update failed');
        process.exit(1);
      }

      success('Updated core content');
      if (coreResult.fileOps) {
        info(
          `Files: ${coreResult.fileOps.created} added, ${coreResult.fileOps.updated} updated, ${coreResult.fileOps.preserved} preserved`
        );
        if (coreResult.fileOps.updatesPath) {
          info(`Preserved-file updates saved to: ${coreResult.fileOps.updatesPath}`);
        }
        if (coreResult.fileOps.backupPath) {
          info(`Backup saved to: ${coreResult.fileOps.backupPath}`);
        }
        if (coreResult.fileOps.preserved > 0 && !options.force) {
          warning('Some local changes were preserved; use --force to overwrite them.');
        }
      }

      // Re-setup IDEs
      ideManager.setAgileflowFolder(config.agileflowFolder);
      ideManager.setDocsFolder(config.docsFolder);

      for (const ide of config.ides) {
        await ideManager.setup(ide, directory, status.path);
      }

      // Create/update docs structure (idempotent - only creates missing files)
      displaySection('Updating Documentation Structure', `Folder: ${config.docsFolder}/`);
      const docsResult = await createDocsStructure(directory, config.docsFolder, {
        updateGitignore: false,
      });

      if (!docsResult.success) {
        warning('Failed to update docs structure');
        if (docsResult.errors.length > 0) {
          docsResult.errors.forEach(err => error(`  ${err}`));
        }
      }

      console.log(chalk.green(`\n✨ Update complete! (${status.version} → ${latestVersion})\n`));

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

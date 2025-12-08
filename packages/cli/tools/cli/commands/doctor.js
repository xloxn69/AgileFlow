/**
 * AgileFlow CLI - Doctor Command
 *
 * Diagnoses installation issues and validates configuration.
 */

const chalk = require('chalk');
const path = require('node:path');
const fs = require('fs-extra');
const { Installer } = require('../installers/core/installer');
const { displayLogo, displaySection, success, warning, error, info } = require('../lib/ui');
const { getCurrentVersion } = require('../lib/version-checker');

const installer = new Installer();

module.exports = {
  name: 'doctor',
  description: 'Diagnose AgileFlow installation issues',
  options: [
    ['-d, --directory <path>', 'Project directory (default: current directory)'],
  ],
  action: async (options) => {
    try {
      const directory = path.resolve(options.directory || '.');

      displayLogo();
      displaySection('AgileFlow Diagnostics');

      let issues = 0;
      let warnings = 0;

      // Check Node.js version
      console.log(chalk.bold('Environment:'));
      const nodeVersion = process.version;
      const requiredNode = '18.0.0';

      if (compareVersions(nodeVersion.slice(1), requiredNode) >= 0) {
        success(`Node.js ${nodeVersion} (required: >=${requiredNode})`);
      } else {
        error(`Node.js ${nodeVersion} (required: >=${requiredNode})`);
        issues++;
      }

      // Check npm
      try {
        const { execSync } = require('node:child_process');
        const npmVersion = execSync('npm --version', { encoding: 'utf8' }).trim();
        success(`npm v${npmVersion}`);
      } catch {
        warning('npm not found');
        warnings++;
      }

      // Check installation
      console.log(chalk.bold('\nInstallation:'));
      const status = await installer.getStatus(directory);

      if (!status.installed) {
        warning('No AgileFlow installation found');
        console.log(chalk.dim(`  Run 'npx agileflow install' to set up\n`));

        // Summary
        printSummary(issues, warnings);
        process.exit(issues > 0 ? 1 : 0);
      }

      success(`.agileflow/ exists`);

      // Check manifest
      const manifestPath = path.join(status.path, '_cfg', 'manifest.yaml');
      if (await fs.pathExists(manifestPath)) {
        success('manifest.yaml valid');
      } else {
        error('manifest.yaml missing');
        issues++;
      }

      // Check core content
      const counts = await installer.countInstalledItems(status.path);

      if (counts.agents > 0) {
        success(`Core agents: ${counts.agents} files`);
      } else {
        error('Core agents: Missing');
        issues++;
      }

      if (counts.commands > 0) {
        success(`Commands: ${counts.commands} files`);
      } else {
        error('Commands: Missing');
        issues++;
      }

      if (counts.skills > 0) {
        success(`Skills: ${counts.skills} directories`);
      } else {
        warning(`Skills: None found`);
        warnings++;
      }

      // Check IDE configurations
      if (status.ides && status.ides.length > 0) {
        console.log(chalk.bold('\nIDE Configurations:'));

        for (const ide of status.ides) {
          const configPath = getIdeConfigPath(directory, ide);
          const ideName = formatIdeName(ide);

          if (await fs.pathExists(configPath)) {
            // Count files in config
            const files = await countFilesInDir(configPath);
            success(`${ideName}: ${files} files`);
          } else {
            warning(`${ideName}: Config missing (run 'npx agileflow update')`);
            warnings++;
          }
        }
      }

      // Check for orphaned configs
      console.log(chalk.bold('\nOrphan Check:'));
      const allIdes = ['claude-code', 'cursor', 'windsurf'];
      let orphansFound = false;

      for (const ide of allIdes) {
        if (!status.ides || !status.ides.includes(ide)) {
          const configPath = getIdeConfigPath(directory, ide);
          if (await fs.pathExists(configPath)) {
            warning(`${formatIdeName(ide)}: Config exists but not in manifest`);
            orphansFound = true;
            warnings++;
          }
        }
      }

      if (!orphansFound) {
        success('No orphaned configurations');
      }

      // Print summary
      printSummary(issues, warnings);

      process.exit(issues > 0 ? 1 : 0);
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
 * Compare two version strings
 * @param {string} a - Version A
 * @param {string} b - Version B
 * @returns {number} -1, 0, or 1
 */
function compareVersions(a, b) {
  const partsA = a.split('.').map(Number);
  const partsB = b.split('.').map(Number);

  for (let i = 0; i < 3; i++) {
    const numA = partsA[i] || 0;
    const numB = partsB[i] || 0;

    if (numA > numB) return 1;
    if (numA < numB) return -1;
  }

  return 0;
}

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

/**
 * Count files in directory recursively
 * @param {string} dirPath - Directory path
 * @returns {Promise<number>}
 */
async function countFilesInDir(dirPath) {
  let count = 0;

  const entries = await fs.readdir(dirPath, { withFileTypes: true });

  for (const entry of entries) {
    if (entry.isFile()) {
      count++;
    } else if (entry.isDirectory()) {
      count += await countFilesInDir(path.join(dirPath, entry.name));
    }
  }

  return count;
}

/**
 * Print summary
 * @param {number} issues - Issue count
 * @param {number} warnings - Warning count
 */
function printSummary(issues, warnings) {
  console.log();

  if (issues === 0 && warnings === 0) {
    console.log(chalk.green.bold('No issues found.\n'));
  } else if (issues === 0) {
    console.log(chalk.yellow(`${warnings} warning(s), no critical issues.\n`));
  } else {
    console.log(chalk.red(`${issues} issue(s), ${warnings} warning(s) found.\n`));
  }
}

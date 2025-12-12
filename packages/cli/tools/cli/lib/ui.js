/**
 * AgileFlow CLI - UI Utilities
 *
 * Provides interactive prompts and display utilities for the CLI.
 */

const chalk = require('chalk');
const inquirer = require('inquirer');
const path = require('node:path');
const fs = require('node:fs');

// Load package.json for version
const packageJsonPath = path.join(__dirname, '..', '..', '..', 'package.json');
const packageJson = require(packageJsonPath);

/**
 * Display the AgileFlow ASCII logo
 */
function displayLogo() {
  const logo = `
     _         _ _      _____ _
    / \\   __ _(_) | ___|  ___| | _____      __
   / _ \\ / _\` | | |/ _ \\ |_  | |/ _ \\ \\ /\\ / /
  / ___ \\ (_| | | |  __/  _| | | (_) \\ V  V /
 /_/   \\_\\__, |_|_|\\___|_|   |_|\\___/ \\_/\\_/
         |___/                                `;
  console.log(chalk.cyan(logo));
  console.log(chalk.dim(`  AgileFlow v${packageJson.version} - AI-Driven Agile Development\n`));
}

/**
 * Display a section header
 * @param {string} title - Section title
 * @param {string} subtitle - Optional subtitle
 */
function displaySection(title, subtitle = null) {
  console.log(chalk.bold.cyan(`\n${title}`));
  if (subtitle) {
    console.log(chalk.dim(subtitle));
  }
  console.log();
}

/**
 * Display a success message
 * @param {string} message - Success message
 */
function success(message) {
  console.log(chalk.green(`✓ ${message}`));
}

/**
 * Display a warning message
 * @param {string} message - Warning message
 */
function warning(message) {
  console.log(chalk.yellow(`⚠ ${message}`));
}

/**
 * Display an error message
 * @param {string} message - Error message
 */
function error(message) {
  console.log(chalk.red(`✗ ${message}`));
}

/**
 * Display an info message
 * @param {string} message - Info message
 */
function info(message) {
  console.log(chalk.dim(`  ${message}`));
}

/**
 * Available IDE configurations
 */
const IDE_CHOICES = [
  {
    name: 'Claude Code',
    value: 'claude-code',
    checked: true,
    configDir: '.claude/commands',
    description: 'Anthropic\'s Claude Code IDE',
  },
  {
    name: 'Cursor',
    value: 'cursor',
    checked: false,
    configDir: '.cursor/rules',
    description: 'AI-powered code editor',
  },
  {
    name: 'Windsurf',
    value: 'windsurf',
    checked: false,
    configDir: '.windsurf/workflows',
    description: 'Codeium\'s AI IDE',
  },
];

/**
 * Prompt for installation configuration
 * @returns {Promise<Object>} Installation configuration
 */
async function promptInstall() {
  displayLogo();

  const answers = await inquirer.prompt([
    {
      type: 'input',
      name: 'directory',
      message: 'Where would you like to install AgileFlow?',
      default: '.',
      validate: (input) => {
        const resolved = path.resolve(input);
        const parent = path.dirname(resolved);
        if (!fs.existsSync(parent)) {
          return `Parent directory does not exist: ${parent}`;
        }
        return true;
      },
    },
    {
      type: 'checkbox',
      name: 'ides',
      message: 'Select your IDE(s):',
      choices: IDE_CHOICES,
      validate: (input) => {
        if (input.length === 0) {
          return 'Please select at least one IDE';
        }
        return true;
      },
    },
    {
      type: 'input',
      name: 'userName',
      message: 'What should agents call you?',
      default: 'Developer',
    },
    {
      type: 'input',
      name: 'agileflowFolder',
      message: 'AgileFlow installation folder name:',
      default: '.agileflow',
      validate: (input) => {
        if (!/^[a-zA-Z0-9._-]+$/.test(input)) {
          return 'Folder name can only contain letters, numbers, dots, underscores, and hyphens';
        }
        return true;
      },
    },
    {
      type: 'input',
      name: 'docsFolder',
      message: 'Documentation folder name:',
      default: 'docs',
      validate: (input) => {
        if (!/^[a-zA-Z0-9._-]+$/.test(input)) {
          return 'Folder name can only contain letters, numbers, dots, underscores, and hyphens';
        }
        return true;
      },
    },
  ]);

  return {
    directory: path.resolve(answers.directory),
    ides: answers.ides,
    userName: answers.userName,
    agileflowFolder: answers.agileflowFolder,
    docsFolder: answers.docsFolder,
  };
}

/**
 * Prompt for confirmation
 * @param {string} message - Confirmation message
 * @param {boolean} defaultValue - Default value
 * @returns {Promise<boolean>}
 */
async function confirm(message, defaultValue = true) {
  const { confirmed } = await inquirer.prompt([
    {
      type: 'confirm',
      name: 'confirmed',
      message,
      default: defaultValue,
    },
  ]);
  return confirmed;
}

/**
 * Get IDE configuration by name
 * @param {string} ideName - IDE name
 * @returns {Object|null}
 */
function getIdeConfig(ideName) {
  return IDE_CHOICES.find((ide) => ide.value === ideName) || null;
}

module.exports = {
  displayLogo,
  displaySection,
  success,
  warning,
  error,
  info,
  promptInstall,
  confirm,
  getIdeConfig,
  IDE_CHOICES,
};

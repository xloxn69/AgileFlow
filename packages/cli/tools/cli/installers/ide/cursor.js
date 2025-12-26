/**
 * AgileFlow CLI - Cursor IDE Installer
 *
 * Installs AgileFlow commands for Cursor IDE.
 * Cursor uses plain Markdown files in .cursor/commands/
 */

const path = require('node:path');
const fs = require('fs-extra');
const chalk = require('chalk');
const { BaseIdeSetup } = require('./_base-ide');

/**
 * Cursor IDE setup handler
 */
class CursorSetup extends BaseIdeSetup {
  constructor() {
    super('cursor', 'Cursor', false);
    this.configDir = '.cursor';
    this.commandsDir = 'commands';
  }

  /**
   * Setup Cursor IDE configuration
   * @param {string} projectDir - Project directory
   * @param {string} agileflowDir - AgileFlow installation directory
   * @param {Object} options - Setup options
   */
  async setup(projectDir, agileflowDir, options = {}) {
    console.log(chalk.hex('#e8683a')(`  Setting up ${this.displayName}...`));

    // Clean up old installation first
    await this.cleanup(projectDir);

    // Create .cursor/commands/AgileFlow directory
    const cursorDir = path.join(projectDir, this.configDir);
    const commandsDir = path.join(cursorDir, this.commandsDir);
    const agileflowCommandsDir = path.join(commandsDir, 'AgileFlow');

    // Install commands using shared recursive method
    const commandsSource = path.join(agileflowDir, 'commands');
    const commandResult = await this.installCommandsRecursive(
      commandsSource,
      agileflowCommandsDir,
      agileflowDir,
      true // Inject dynamic content
    );

    // Install agents as subdirectory
    const agentsSource = path.join(agileflowDir, 'agents');
    const agentsTargetDir = path.join(agileflowCommandsDir, 'agents');
    const agentResult = await this.installCommandsRecursive(
      agentsSource,
      agentsTargetDir,
      agileflowDir,
      false // No dynamic content for agents
    );

    console.log(chalk.green(`  ✓ ${this.displayName} configured:`));
    console.log(chalk.dim(`    - ${commandResult.commands} commands installed`));
    console.log(chalk.dim(`    - ${agentResult.commands} agents installed`));
    console.log(chalk.dim(`    - Path: ${path.relative(projectDir, agileflowCommandsDir)}`));

    return {
      success: true,
      commands: commandResult.commands,
      agents: agentResult.commands,
    };
  }

  /**
   * Cleanup old AgileFlow installation
   * @param {string} projectDir - Project directory
   */
  async cleanup(projectDir) {
    // Remove old .cursor/rules/agileflow (deprecated)
    const oldRulesPath = path.join(projectDir, this.configDir, 'rules', 'agileflow');
    if (await this.exists(oldRulesPath)) {
      await fs.remove(oldRulesPath);
      console.log(chalk.dim(`    Removed old AgileFlow rules from ${this.displayName}`));
    }

    // Remove .cursor/commands/agileflow (for re-installation)
    const commandsPath = path.join(projectDir, this.configDir, this.commandsDir, 'AgileFlow');
    if (await this.exists(commandsPath)) {
      await fs.remove(commandsPath);
    }
  }
}

module.exports = { CursorSetup };

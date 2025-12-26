/**
 * AgileFlow CLI - Windsurf IDE Installer
 *
 * Installs AgileFlow workflows for Windsurf IDE.
 * Windsurf uses markdown files in .windsurf/workflows/
 */

const path = require('node:path');
const fs = require('fs-extra');
const chalk = require('chalk');
const { BaseIdeSetup } = require('./_base-ide');

/**
 * Windsurf IDE setup handler
 */
class WindsurfSetup extends BaseIdeSetup {
  constructor() {
    super('windsurf', 'Windsurf', true);
    this.configDir = '.windsurf';
    this.workflowsDir = 'workflows';
  }

  /**
   * Setup Windsurf IDE configuration
   * @param {string} projectDir - Project directory
   * @param {string} agileflowDir - AgileFlow installation directory
   * @param {Object} options - Setup options
   */
  async setup(projectDir, agileflowDir, options = {}) {
    console.log(chalk.hex('#e8683a')(`  Setting up ${this.displayName}...`));

    // Clean up old installation first
    await this.cleanup(projectDir);

    // Create .windsurf/workflows/agileflow directory
    const windsurfDir = path.join(projectDir, this.configDir);
    const workflowsDir = path.join(windsurfDir, this.workflowsDir);
    const agileflowWorkflowsDir = path.join(workflowsDir, 'agileflow');

    // Install commands using shared recursive method
    const commandsSource = path.join(agileflowDir, 'commands');
    const commandResult = await this.installCommandsRecursive(
      commandsSource,
      agileflowWorkflowsDir,
      agileflowDir,
      true // Inject dynamic content
    );

    // Install agents as subdirectory
    const agentsSource = path.join(agileflowDir, 'agents');
    const agentsTargetDir = path.join(agileflowWorkflowsDir, 'agents');
    const agentResult = await this.installCommandsRecursive(
      agentsSource,
      agentsTargetDir,
      agileflowDir,
      false // No dynamic content for agents
    );

    console.log(chalk.green(`  ✓ ${this.displayName} configured:`));
    console.log(chalk.dim(`    - ${commandResult.commands} workflows installed`));
    console.log(chalk.dim(`    - ${agentResult.commands} agent workflows installed`));
    console.log(chalk.dim(`    - Path: ${path.relative(projectDir, agileflowWorkflowsDir)}`));

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
    const agileflowPath = path.join(projectDir, this.configDir, this.workflowsDir, 'agileflow');
    if (await this.exists(agileflowPath)) {
      await fs.remove(agileflowPath);
      console.log(chalk.dim(`    Removed old AgileFlow workflows from ${this.displayName}`));
    }
  }
}

module.exports = { WindsurfSetup };

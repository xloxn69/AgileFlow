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

    // Create .cursor/commands/agileflow directory
    const cursorDir = path.join(projectDir, this.configDir);
    const commandsDir = path.join(cursorDir, this.commandsDir);
    const agileflowCommandsDir = path.join(commandsDir, 'AgileFlow');

    await this.ensureDir(agileflowCommandsDir);

    // Get commands from AgileFlow installation
    const commandsSource = path.join(agileflowDir, 'commands');
    let commandCount = 0;

    if (await this.exists(commandsSource)) {
      const commands = await this.scanDirectory(commandsSource, '.md');

      for (const command of commands) {
        // Read the original command content
        let content = await this.readFile(command.path);

        // Inject dynamic content (agent lists, command lists)
        content = this.injectDynamicContent(content, agileflowDir);

        // Replace docs/ references with custom folder name
        content = this.replaceDocsReferences(content);

        const targetPath = path.join(agileflowCommandsDir, `${command.name}.md`);
        await this.writeFile(targetPath, content);
        commandCount++;
      }
    }

    // Create agents subdirectory
    const agileflowAgentsDir = path.join(agileflowCommandsDir, 'agents');
    await this.ensureDir(agileflowAgentsDir);

    // Get agents from AgileFlow installation
    const agentsSource = path.join(agileflowDir, 'agents');
    let agentCount = 0;

    if (await this.exists(agentsSource)) {
      const agents = await this.scanDirectory(agentsSource, '.md');

      for (const agent of agents) {
        // Read the original agent content
        let content = await this.readFile(agent.path);

        // Replace docs/ references with custom folder name
        content = this.replaceDocsReferences(content);

        const targetPath = path.join(agileflowAgentsDir, `${agent.name}.md`);
        await this.writeFile(targetPath, content);
        agentCount++;
      }
    }

    console.log(chalk.green(`  ✓ ${this.displayName} configured:`));
    console.log(chalk.dim(`    - ${commandCount} commands installed`));
    console.log(chalk.dim(`    - ${agentCount} agents installed`));
    console.log(chalk.dim(`    - Path: ${path.relative(projectDir, agileflowCommandsDir)}`));

    return {
      success: true,
      commands: commandCount,
      agents: agentCount,
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

/**
 * AgileFlow CLI - Claude Code IDE Installer
 *
 * Installs AgileFlow commands for Claude Code IDE.
 */

const path = require('node:path');
const fs = require('fs-extra');
const chalk = require('chalk');
const { BaseIdeSetup } = require('./_base-ide');

/**
 * Claude Code IDE setup handler
 */
class ClaudeCodeSetup extends BaseIdeSetup {
  constructor() {
    super('claude-code', 'Claude Code', true);
    this.configDir = '.claude';
    this.commandsDir = 'commands';
  }

  /**
   * Setup Claude Code IDE configuration
   * @param {string} projectDir - Project directory
   * @param {string} agileflowDir - AgileFlow installation directory
   * @param {Object} options - Setup options
   */
  async setup(projectDir, agileflowDir, options = {}) {
    console.log(chalk.cyan(`  Setting up ${this.displayName}...`));

    // Clean up old installation first
    await this.cleanup(projectDir);

    // Create .claude/commands/AgileFlow directory
    const claudeDir = path.join(projectDir, this.configDir);
    const commandsDir = path.join(claudeDir, this.commandsDir);
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
}

module.exports = { ClaudeCodeSetup };

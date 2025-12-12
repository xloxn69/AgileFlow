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
        // Create launcher file that references the command
        const launcherContent = await this.createCommandLauncher(command, agileflowDir, projectDir);
        const targetPath = path.join(agileflowCommandsDir, `${command.name}.md`);

        await this.writeFile(targetPath, launcherContent);
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
        // Create launcher file that references the agent
        const launcherContent = await this.createAgentLauncher(agent, agileflowDir, projectDir);
        const targetPath = path.join(agileflowAgentsDir, `${agent.name}.md`);

        await this.writeFile(targetPath, launcherContent);
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
   * Create a command launcher file
   * @param {Object} command - Command info
   * @param {string} agileflowDir - AgileFlow directory
   * @param {string} projectDir - Project directory
   * @returns {Promise<string>} Launcher content
   */
  async createCommandLauncher(command, agileflowDir, projectDir) {
    // Read the original command file
    const content = await this.readFile(command.path);

    // Extract description from frontmatter if present
    const frontmatterMatch = content.match(/^---\n([\s\S]*?)\n---/);
    let description = command.name;

    if (frontmatterMatch) {
      const descMatch = frontmatterMatch[1].match(/description:\s*["']?([^"'\n]+)["']?/);
      if (descMatch) {
        description = descMatch[1];
      }
    }

    // Create launcher that loads the full command
    const relativePath = path.relative(projectDir, command.path);

    return `---
description: "${description}"
---

# ${command.name}

Load and execute the AgileFlow command.

\`\`\`
Read and follow the instructions in: ${relativePath}
\`\`\`
`;
  }

  /**
   * Create an agent launcher file
   * @param {Object} agent - Agent info
   * @param {string} agileflowDir - AgileFlow directory
   * @param {string} projectDir - Project directory
   * @returns {Promise<string>} Launcher content
   */
  async createAgentLauncher(agent, agileflowDir, projectDir) {
    // Read the original agent file
    const content = await this.readFile(agent.path);

    // Extract metadata from frontmatter
    const frontmatterMatch = content.match(/^---\n([\s\S]*?)\n---/);
    let description = agent.name;
    let name = agent.name;

    if (frontmatterMatch) {
      const descMatch = frontmatterMatch[1].match(/description:\s*["']?([^"'\n]+)["']?/);
      const nameMatch = frontmatterMatch[1].match(/name:\s*["']?([^"'\n]+)["']?/);

      if (descMatch) description = descMatch[1];
      if (nameMatch) name = nameMatch[1];
    }

    // Create launcher that loads the full agent
    const relativePath = path.relative(projectDir, agent.path);

    return `---
description: "${description}"
---

# ${name}

Activate the AgileFlow agent.

\`\`\`
Read and fully embody the agent defined in: ${relativePath}

Follow all instructions, adopt the persona, and use the specified tools.
\`\`\`
`;
  }
}

module.exports = { ClaudeCodeSetup };

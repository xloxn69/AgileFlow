/**
 * AgileFlow CLI - Cursor IDE Installer
 *
 * Installs AgileFlow rules for Cursor IDE.
 * Cursor uses .mdc (Markdown with Context) files in .cursor/rules/
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
    super('cursor', 'Cursor', true);
    this.configDir = '.cursor';
    this.rulesDir = 'rules';
  }

  /**
   * Setup Cursor IDE configuration
   * @param {string} projectDir - Project directory
   * @param {string} agileflowDir - AgileFlow installation directory
   * @param {Object} options - Setup options
   */
  async setup(projectDir, agileflowDir, options = {}) {
    console.log(chalk.cyan(`  Setting up ${this.displayName}...`));

    // Clean up old installation first
    await this.cleanup(projectDir);

    // Create .cursor/rules/agileflow directory
    const cursorDir = path.join(projectDir, this.configDir);
    const rulesDir = path.join(cursorDir, this.rulesDir);
    const agileflowRulesDir = path.join(rulesDir, 'agileflow');

    await this.ensureDir(agileflowRulesDir);

    // Get commands from AgileFlow installation
    const commandsSource = path.join(agileflowDir, 'commands');
    let commandCount = 0;

    if (await this.exists(commandsSource)) {
      const commands = await this.scanDirectory(commandsSource, '.md');

      for (const command of commands) {
        // Create .mdc file with MDC format
        const mdcContent = await this.createCommandMdc(command, agileflowDir, projectDir);
        const targetPath = path.join(agileflowRulesDir, `${command.name}.mdc`);

        await this.writeFile(targetPath, mdcContent);
        commandCount++;
      }
    }

    // Create agents subdirectory
    const agileflowAgentsDir = path.join(agileflowRulesDir, 'agents');
    await this.ensureDir(agileflowAgentsDir);

    // Get agents from AgileFlow installation
    const agentsSource = path.join(agileflowDir, 'agents');
    let agentCount = 0;

    if (await this.exists(agentsSource)) {
      const agents = await this.scanDirectory(agentsSource, '.md');

      for (const agent of agents) {
        // Create .mdc file with MDC format
        const mdcContent = await this.createAgentMdc(agent, agileflowDir, projectDir);
        const targetPath = path.join(agileflowAgentsDir, `${agent.name}.mdc`);

        await this.writeFile(targetPath, mdcContent);
        agentCount++;
      }
    }

    console.log(chalk.green(`  ✓ ${this.displayName} configured:`));
    console.log(chalk.dim(`    - ${commandCount} rules installed`));
    console.log(chalk.dim(`    - ${agentCount} agent rules installed`));
    console.log(chalk.dim(`    - Path: ${path.relative(projectDir, agileflowRulesDir)}`));

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
    const agileflowPath = path.join(projectDir, this.configDir, this.rulesDir, 'agileflow');
    if (await this.exists(agileflowPath)) {
      await fs.remove(agileflowPath);
      console.log(chalk.dim(`    Removed old AgileFlow rules from ${this.displayName}`));
    }
  }

  /**
   * Create an MDC file for a command
   * @param {Object} command - Command info
   * @param {string} agileflowDir - AgileFlow directory
   * @param {string} projectDir - Project directory
   * @returns {Promise<string>} MDC content
   */
  async createCommandMdc(command, agileflowDir, projectDir) {
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

    // Create MDC format with metadata
    const relativePath = path.relative(projectDir, command.path);

    return `---
description: "${description}"
globs: []
alwaysApply: false
---

# AgileFlow: ${command.name}

Load and execute the AgileFlow command from: ${relativePath}

When this rule is activated, read the full command file and follow its instructions.
`;
  }

  /**
   * Create an MDC file for an agent
   * @param {Object} agent - Agent info
   * @param {string} agileflowDir - AgileFlow directory
   * @param {string} projectDir - Project directory
   * @returns {Promise<string>} MDC content
   */
  async createAgentMdc(agent, agileflowDir, projectDir) {
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

    // Create MDC format
    const relativePath = path.relative(projectDir, agent.path);

    return `---
description: "${description}"
globs: []
alwaysApply: false
---

# AgileFlow Agent: ${name}

Activate the AgileFlow agent from: ${relativePath}

When this rule is activated:
1. Read the full agent file
2. Adopt the agent's persona and communication style
3. Follow all instructions and use specified tools
4. Stay in character until given an exit command
`;
  }
}

module.exports = { CursorSetup };

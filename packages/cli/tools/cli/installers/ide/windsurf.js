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
    console.log(chalk.cyan(`  Setting up ${this.displayName}...`));

    // Clean up old installation first
    await this.cleanup(projectDir);

    // Create .windsurf/workflows/agileflow directory
    const windsurfDir = path.join(projectDir, this.configDir);
    const workflowsDir = path.join(windsurfDir, this.workflowsDir);
    const agileflowWorkflowsDir = path.join(workflowsDir, 'agileflow');

    await this.ensureDir(agileflowWorkflowsDir);

    // Get commands from AgileFlow installation
    const commandsSource = path.join(agileflowDir, 'commands');
    let commandCount = 0;

    if (await this.exists(commandsSource)) {
      const commands = await this.scanDirectory(commandsSource, '.md');

      for (const command of commands) {
        // Create workflow file
        const workflowContent = await this.createCommandWorkflow(command, agileflowDir, projectDir);
        const targetPath = path.join(agileflowWorkflowsDir, `${command.name}.md`);

        await this.writeFile(targetPath, workflowContent);
        commandCount++;
      }
    }

    // Create agents subdirectory
    const agileflowAgentsDir = path.join(agileflowWorkflowsDir, 'agents');
    await this.ensureDir(agileflowAgentsDir);

    // Get agents from AgileFlow installation
    const agentsSource = path.join(agileflowDir, 'agents');
    let agentCount = 0;

    if (await this.exists(agentsSource)) {
      const agents = await this.scanDirectory(agentsSource, '.md');

      for (const agent of agents) {
        // Create workflow file
        const workflowContent = await this.createAgentWorkflow(agent, agileflowDir, projectDir);
        const targetPath = path.join(agileflowAgentsDir, `${agent.name}.md`);

        await this.writeFile(targetPath, workflowContent);
        agentCount++;
      }
    }

    console.log(chalk.green(`  ✓ ${this.displayName} configured:`));
    console.log(chalk.dim(`    - ${commandCount} workflows installed`));
    console.log(chalk.dim(`    - ${agentCount} agent workflows installed`));
    console.log(chalk.dim(`    - Path: ${path.relative(projectDir, agileflowWorkflowsDir)}`));

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
    const agileflowPath = path.join(projectDir, this.configDir, this.workflowsDir, 'agileflow');
    if (await this.exists(agileflowPath)) {
      await fs.remove(agileflowPath);
      console.log(chalk.dim(`    Removed old AgileFlow workflows from ${this.displayName}`));
    }
  }

  /**
   * Create a workflow file for a command
   * @param {Object} command - Command info
   * @param {string} agileflowDir - AgileFlow directory
   * @param {string} projectDir - Project directory
   * @returns {Promise<string>} Workflow content
   */
  async createCommandWorkflow(command, agileflowDir, projectDir) {
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

    // Create Windsurf workflow format
    const relativePath = path.relative(projectDir, command.path);

    return `---
description: ${description}
auto_execution_mode: 2
---

# AgileFlow: ${command.name}

Load and execute the AgileFlow command.

## Instructions

Read and follow the full command from: \`${relativePath}\`

Execute the command according to its specifications.
`;
  }

  /**
   * Create a workflow file for an agent
   * @param {Object} agent - Agent info
   * @param {string} agileflowDir - AgileFlow directory
   * @param {string} projectDir - Project directory
   * @returns {Promise<string>} Workflow content
   */
  async createAgentWorkflow(agent, agileflowDir, projectDir) {
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

    // Create Windsurf workflow format
    const relativePath = path.relative(projectDir, agent.path);

    return `---
description: ${description}
auto_execution_mode: 3
---

# AgileFlow Agent: ${name}

Activate the AgileFlow agent.

## Instructions

1. Read the full agent definition from: \`${relativePath}\`
2. Adopt the agent's persona and communication style
3. Follow all instructions and use the specified tools
4. Maintain the agent's character throughout the session
`;
  }
}

module.exports = { WindsurfSetup };

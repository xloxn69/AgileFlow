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
    console.log(chalk.hex('#C15F3C')(`  Setting up ${this.displayName}...`));

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
        // Read the original command content
        let content = await this.readFile(command.path);

        // Inject dynamic content (agent lists, command lists)
        content = this.injectDynamicContent(content, agileflowDir);

        // Replace docs/ references with custom folder name
        content = this.replaceDocsReferences(content);

        const targetPath = path.join(agileflowWorkflowsDir, `${command.name}.md`);
        await this.writeFile(targetPath, content);
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
}

module.exports = { WindsurfSetup };

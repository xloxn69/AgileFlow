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
    console.log(chalk.hex('#e8683a')(`  Setting up ${this.displayName}...`));

    // Clean up old installation first
    await this.cleanup(projectDir);

    // Create .claude/commands/agileflow directory
    const claudeDir = path.join(projectDir, this.configDir);
    const commandsDir = path.join(claudeDir, this.commandsDir);
    const agileflowCommandsDir = path.join(commandsDir, 'agileflow');

    await this.ensureDir(agileflowCommandsDir);

    // Recursively install all commands (including subdirectories like agents/, session/)
    const commandsSource = path.join(agileflowDir, 'commands');
    const commandResult = await this.installCommandsRecursive(
      commandsSource,
      agileflowCommandsDir,
      agileflowDir,
      true // Inject dynamic content for top-level commands
    );

    // Also install agents as slash commands (.claude/commands/agileflow/agents/)
    const agentsSource = path.join(agileflowDir, 'agents');
    const agentsTargetDir = path.join(agileflowCommandsDir, 'agents');
    const agentResult = await this.installCommandsRecursive(
      agentsSource,
      agentsTargetDir,
      agileflowDir,
      false // No dynamic content for agents
    );

    // ALSO install agents as spawnable subagents (.claude/agents/agileflow/)
    // This allows Task tool to spawn them with subagent_type: "agileflow-ui"
    const spawnableAgentsDir = path.join(claudeDir, 'agents', 'agileflow');
    await this.installCommandsRecursive(agentsSource, spawnableAgentsDir, agileflowDir, false);
    console.log(chalk.dim(`    - Spawnable agents: .claude/agents/agileflow/`));

    // Create skills directory for user-generated skills (.claude/skills/)
    // AgileFlow no longer ships static skills - users generate them via /agileflow:skill:create
    const skillsTargetDir = path.join(claudeDir, 'skills');
    await this.ensureDir(skillsTargetDir);
    console.log(chalk.dim(`    - Skills directory: .claude/skills/ (for user-generated skills)`));

    const totalCommands = commandResult.commands + agentResult.commands;
    const totalSubdirs =
      commandResult.subdirs + (agentResult.commands > 0 ? 1 : 0) + agentResult.subdirs;

    console.log(chalk.green(`  ✓ ${this.displayName} configured:`));
    console.log(chalk.dim(`    - ${totalCommands} commands installed`));
    if (totalSubdirs > 0) {
      console.log(chalk.dim(`    - ${totalSubdirs} subdirectories`));
    }
    console.log(chalk.dim(`    - Path: ${path.relative(projectDir, agileflowCommandsDir)}`));

    return {
      success: true,
      commands: totalCommands,
      subdirs: totalSubdirs,
    };
  }
}

module.exports = { ClaudeCodeSetup };

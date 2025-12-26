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
   * Recursively install commands from a source directory
   * @param {string} sourceDir - Source directory path
   * @param {string} targetDir - Target directory path
   * @param {string} agileflowDir - AgileFlow installation directory (for dynamic content)
   * @param {boolean} injectDynamic - Whether to inject dynamic content (only for top-level commands)
   * @returns {Promise<{commands: number, subdirs: number}>} Count of installed items
   */
  async installCommandsRecursive(sourceDir, targetDir, agileflowDir, injectDynamic = false) {
    let commandCount = 0;
    let subdirCount = 0;

    if (!(await this.exists(sourceDir))) {
      return { commands: 0, subdirs: 0 };
    }

    await this.ensureDir(targetDir);

    const entries = await fs.readdir(sourceDir, { withFileTypes: true });

    for (const entry of entries) {
      const sourcePath = path.join(sourceDir, entry.name);
      const targetPath = path.join(targetDir, entry.name);

      if (entry.isFile() && entry.name.endsWith('.md')) {
        // Read and process .md file
        let content = await this.readFile(sourcePath);

        // Inject dynamic content if enabled (for top-level commands)
        if (injectDynamic) {
          content = this.injectDynamicContent(content, agileflowDir);
        }

        // Replace docs/ references with custom folder name
        content = this.replaceDocsReferences(content);

        await this.writeFile(targetPath, content);
        commandCount++;
      } else if (entry.isDirectory()) {
        // Recursively process subdirectory
        const subResult = await this.installCommandsRecursive(
          sourcePath,
          targetPath,
          agileflowDir,
          false // Don't inject dynamic content in subdirectories
        );
        commandCount += subResult.commands;
        subdirCount += 1 + subResult.subdirs;
      }
    }

    return { commands: commandCount, subdirs: subdirCount };
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

    // Install skills (.claude/skills/)
    const skillsSource = path.join(agileflowDir, 'skills');
    const skillsTargetDir = path.join(claudeDir, 'skills');
    let skillCount = 0;
    if (await this.exists(skillsSource)) {
      const skillResult = await this.installCommandsRecursive(
        skillsSource,
        skillsTargetDir,
        agileflowDir,
        false
      );
      skillCount = skillResult.commands + skillResult.subdirs;
      if (skillCount > 0) {
        console.log(chalk.dim(`    - Skills: .claude/skills/`));
      }
    }

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

/**
 * AgileFlow CLI - Core Installer
 *
 * Handles the main installation logic for AgileFlow.
 */

const path = require('node:path');
const fs = require('fs-extra');
const chalk = require('chalk');
const ora = require('ora');
const yaml = require('js-yaml');

/**
 * Get the source path for AgileFlow content
 * @returns {string} Path to src directory
 */
function getSourcePath() {
  return path.join(__dirname, '..', '..', '..', '..', 'src');
}

/**
 * Get the package root path
 * @returns {string} Path to package root
 */
function getPackageRoot() {
  return path.join(__dirname, '..', '..', '..', '..');
}

/**
 * Core Installer class
 */
class Installer {
  constructor() {
    this.sourcePath = getSourcePath();
    this.packageRoot = getPackageRoot();
  }

  /**
   * Install AgileFlow to a project
   * @param {Object} config - Installation configuration
   * @returns {Promise<Object>} Installation result
   */
  async install(config) {
    const { directory, ides, userName, agileflowFolder } = config;

    const agileflowDir = path.join(directory, agileflowFolder);
    const spinner = ora('Installing AgileFlow...').start();

    try {
      // Create AgileFlow directory
      await fs.ensureDir(agileflowDir);
      spinner.text = 'Creating directory structure...';

      // Create _cfg directory for manifest
      const cfgDir = path.join(agileflowDir, '_cfg');
      await fs.ensureDir(cfgDir);

      // Copy core content
      spinner.text = 'Installing core content...';
      const coreSourcePath = path.join(this.sourcePath, 'core');

      if (await fs.pathExists(coreSourcePath)) {
        await this.copyContent(coreSourcePath, agileflowDir, agileflowFolder);
      } else {
        // Fallback: copy from old structure (commands, agents, skills at root)
        await this.copyLegacyContent(directory, agileflowDir, agileflowFolder);
      }

      // Create config.yaml
      spinner.text = 'Creating configuration...';
      await this.createConfig(agileflowDir, userName, agileflowFolder);

      // Create manifest
      spinner.text = 'Creating manifest...';
      await this.createManifest(cfgDir, ides);

      // Count installed items
      const counts = await this.countInstalledItems(agileflowDir);

      spinner.succeed('Core installation complete');

      return {
        success: true,
        path: agileflowDir,
        projectDir: directory,
        counts,
      };
    } catch (error) {
      spinner.fail('Installation failed');
      throw error;
    }
  }

  /**
   * Copy content from source to destination with placeholder replacement
   * @param {string} source - Source directory
   * @param {string} dest - Destination directory
   * @param {string} agileflowFolder - AgileFlow folder name
   */
  async copyContent(source, dest, agileflowFolder) {
    const entries = await fs.readdir(source, { withFileTypes: true });

    for (const entry of entries) {
      const srcPath = path.join(source, entry.name);
      const destPath = path.join(dest, entry.name);

      if (entry.isDirectory()) {
        await fs.ensureDir(destPath);
        await this.copyContent(srcPath, destPath, agileflowFolder);
      } else {
        await this.copyFileWithReplacements(srcPath, destPath, agileflowFolder);
      }
    }
  }

  /**
   * Copy legacy content structure (from root commands/agents/skills)
   * @param {string} projectDir - Project directory
   * @param {string} agileflowDir - AgileFlow installation directory
   * @param {string} agileflowFolder - AgileFlow folder name
   */
  async copyLegacyContent(projectDir, agileflowDir, agileflowFolder) {
    const packageRoot = this.packageRoot;

    // Copy commands
    const commandsSource = path.join(packageRoot, 'commands');
    const commandsDest = path.join(agileflowDir, 'commands');
    if (await fs.pathExists(commandsSource)) {
      await fs.ensureDir(commandsDest);
      await this.copyContent(commandsSource, commandsDest, agileflowFolder);
    }

    // Copy agents
    const agentsSource = path.join(packageRoot, 'agents');
    const agentsDest = path.join(agileflowDir, 'agents');
    if (await fs.pathExists(agentsSource)) {
      await fs.ensureDir(agentsDest);
      await this.copyContent(agentsSource, agentsDest, agileflowFolder);
    }

    // Copy skills
    const skillsSource = path.join(packageRoot, 'skills');
    const skillsDest = path.join(agileflowDir, 'skills');
    if (await fs.pathExists(skillsSource)) {
      await fs.ensureDir(skillsDest);
      await this.copyContent(skillsSource, skillsDest, agileflowFolder);
    }

    // Copy templates
    const templatesSource = path.join(packageRoot, 'templates');
    const templatesDest = path.join(agileflowDir, 'templates');
    if (await fs.pathExists(templatesSource)) {
      await fs.ensureDir(templatesDest);
      await this.copyContent(templatesSource, templatesDest, agileflowFolder);
    }
  }

  /**
   * Copy a file with placeholder replacements
   * @param {string} source - Source file path
   * @param {string} dest - Destination file path
   * @param {string} agileflowFolder - AgileFlow folder name
   */
  async copyFileWithReplacements(source, dest, agileflowFolder) {
    const textExtensions = ['.md', '.yaml', '.yml', '.txt', '.json'];
    const ext = path.extname(source).toLowerCase();

    if (textExtensions.includes(ext)) {
      let content = await fs.readFile(source, 'utf8');

      // Replace placeholders
      content = content.replace(/\{agileflow_folder\}/g, agileflowFolder);
      content = content.replace(/\{project-root\}/g, '{project-root}'); // Keep as-is for runtime

      await fs.writeFile(dest, content, 'utf8');
    } else {
      await fs.copy(source, dest);
    }
  }

  /**
   * Create configuration file
   * @param {string} agileflowDir - AgileFlow directory
   * @param {string} userName - User name
   * @param {string} agileflowFolder - AgileFlow folder name
   */
  async createConfig(agileflowDir, userName, agileflowFolder) {
    const config = {
      version: require(path.join(this.packageRoot, 'package.json')).version,
      user_name: userName,
      agileflow_folder: agileflowFolder,
      communication_language: 'English',
      created_at: new Date().toISOString(),
    };

    const configPath = path.join(agileflowDir, 'config.yaml');
    await fs.writeFile(configPath, yaml.dump(config), 'utf8');
  }

  /**
   * Create manifest file
   * @param {string} cfgDir - Config directory
   * @param {string[]} ides - Selected IDEs
   */
  async createManifest(cfgDir, ides) {
    const packageJson = require(path.join(this.packageRoot, 'package.json'));

    const manifest = {
      version: packageJson.version,
      installed_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
      ides: ides,
      modules: ['core'],
    };

    const manifestPath = path.join(cfgDir, 'manifest.yaml');
    await fs.writeFile(manifestPath, yaml.dump(manifest), 'utf8');
  }

  /**
   * Count installed items
   * @param {string} agileflowDir - AgileFlow directory
   * @returns {Promise<Object>} Counts
   */
  async countInstalledItems(agileflowDir) {
    const counts = {
      agents: 0,
      commands: 0,
      skills: 0,
    };

    // Count agents
    const agentsDir = path.join(agileflowDir, 'agents');
    if (await fs.pathExists(agentsDir)) {
      const files = await fs.readdir(agentsDir);
      counts.agents = files.filter((f) => f.endsWith('.md')).length;
    }

    // Count commands
    const commandsDir = path.join(agileflowDir, 'commands');
    if (await fs.pathExists(commandsDir)) {
      const files = await fs.readdir(commandsDir);
      counts.commands = files.filter((f) => f.endsWith('.md')).length;
    }

    // Count skills
    const skillsDir = path.join(agileflowDir, 'skills');
    if (await fs.pathExists(skillsDir)) {
      const entries = await fs.readdir(skillsDir, { withFileTypes: true });
      counts.skills = entries.filter((e) => e.isDirectory()).length;
    }

    return counts;
  }

  /**
   * Get installation status
   * @param {string} directory - Project directory
   * @returns {Promise<Object>} Installation status
   */
  async getStatus(directory) {
    const status = {
      installed: false,
      path: null,
      version: null,
      ides: [],
      modules: [],
    };

    // Look for AgileFlow installation
    const possibleFolders = ['.agileflow', 'agileflow', '.aflow'];

    for (const folder of possibleFolders) {
      const agileflowDir = path.join(directory, folder);
      const manifestPath = path.join(agileflowDir, '_cfg', 'manifest.yaml');

      if (await fs.pathExists(manifestPath)) {
        status.installed = true;
        status.path = agileflowDir;

        const manifestContent = await fs.readFile(manifestPath, 'utf8');
        const manifest = yaml.load(manifestContent);

        status.version = manifest.version;
        status.ides = manifest.ides || [];
        status.modules = manifest.modules || [];

        break;
      }
    }

    return status;
  }
}

module.exports = { Installer, getSourcePath, getPackageRoot };

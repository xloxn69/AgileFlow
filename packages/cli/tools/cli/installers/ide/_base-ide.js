/**
 * AgileFlow CLI - Base IDE Installer
 *
 * Abstract base class for IDE-specific installers.
 */

const path = require('node:path');
const fs = require('fs-extra');
const chalk = require('chalk');

/**
 * Base class for IDE-specific setup
 * All IDE handlers should extend this class
 */
class BaseIdeSetup {
  constructor(name, displayName = null, preferred = false) {
    this.name = name;
    this.displayName = displayName || name;
    this.preferred = preferred;
    this.configDir = null; // Override in subclasses
    this.agileflowFolder = '.agileflow';
    this.docsFolder = 'docs';
  }

  /**
   * Set the AgileFlow folder name
   * @param {string} folderName - The AgileFlow folder name
   */
  setAgileflowFolder(folderName) {
    this.agileflowFolder = folderName;
  }

  /**
   * Set the docs folder name
   * @param {string} folderName - The docs folder name
   */
  setDocsFolder(folderName) {
    this.docsFolder = folderName;
  }

  /**
   * Replace docs/ references in content with custom folder name
   * @param {string} content - File content
   * @returns {string} Updated content
   */
  replaceDocsReferences(content) {
    if (this.docsFolder === 'docs') {
      return content; // No replacement needed
    }

    // Replace all variations of docs/ references
    return content
      .replace(/docs\//g, `${this.docsFolder}/`)
      .replace(/`docs\//g, `\`${this.docsFolder}/`)
      .replace(/"docs\//g, `"${this.docsFolder}/`)
      .replace(/'docs\//g, `'${this.docsFolder}/`)
      .replace(/\(docs\//g, `(${this.docsFolder}/`)
      .replace(/docs\/\)/g, `${this.docsFolder}/)`)
      .replace(/\bdocs\b(?!\.)/g, this.docsFolder); // Replace standalone "docs" word
  }

  /**
   * Inject dynamic content into template (agent lists, command lists)
   * @param {string} content - Template file content
   * @param {string} agileflowDir - AgileFlow installation directory
   * @returns {string} Content with placeholders replaced
   */
  injectDynamicContent(content, agileflowDir) {
    const { injectContent } = require('../../lib/content-injector');
    // agileflowDir is the user's .agileflow installation directory
    // which has agents/ and commands/ at the root level (not src/core/)
    const agentsDir = path.join(agileflowDir, 'agents');
    const commandsDir = path.join(agileflowDir, 'commands');

    return injectContent(content, agentsDir, commandsDir);
  }

  /**
   * Main setup method - must be implemented by subclasses
   * @param {string} projectDir - Project directory
   * @param {string} agileflowDir - AgileFlow installation directory
   * @param {Object} options - Setup options
   */
  async setup(projectDir, agileflowDir, options = {}) {
    throw new Error(`setup() must be implemented by ${this.name} handler`);
  }

  /**
   * Cleanup IDE configuration
   * @param {string} projectDir - Project directory
   */
  async cleanup(projectDir) {
    if (this.configDir) {
      // Clean up both old (AgileFlow) and new (agileflow) folder names
      for (const folderName of ['agileflow', 'AgileFlow']) {
        const agileflowPath = path.join(projectDir, this.configDir, 'commands', folderName);
        if (await fs.pathExists(agileflowPath)) {
          await fs.remove(agileflowPath);
          console.log(
            chalk.dim(`  Removed old ${folderName} configuration from ${this.displayName}`)
          );
        }
      }
    }
  }

  /**
   * Detect if this IDE is configured in the project
   * @param {string} projectDir - Project directory
   * @returns {Promise<boolean>}
   */
  async detect(projectDir) {
    if (this.configDir) {
      const configPath = path.join(projectDir, this.configDir);
      return fs.pathExists(configPath);
    }
    return false;
  }

  /**
   * Ensure a directory exists
   * @param {string} dirPath - Directory path
   */
  async ensureDir(dirPath) {
    await fs.ensureDir(dirPath);
  }

  /**
   * Write a file
   * @param {string} filePath - File path
   * @param {string} content - File content
   */
  async writeFile(filePath, content) {
    await fs.writeFile(filePath, content, 'utf8');
  }

  /**
   * Read a file
   * @param {string} filePath - File path
   * @returns {Promise<string>} File content
   */
  async readFile(filePath) {
    return fs.readFile(filePath, 'utf8');
  }

  /**
   * Check if a path exists
   * @param {string} filePath - Path to check
   * @returns {Promise<boolean>}
   */
  async exists(filePath) {
    return fs.pathExists(filePath);
  }

  /**
   * Scan a directory for files with a specific extension
   * @param {string} dirPath - Directory path
   * @param {string} extension - File extension (e.g., '.md')
   * @returns {Promise<Array>} List of files
   */
  async scanDirectory(dirPath, extension) {
    const results = [];

    if (!(await this.exists(dirPath))) {
      return results;
    }

    const entries = await fs.readdir(dirPath, { withFileTypes: true });

    for (const entry of entries) {
      if (entry.isFile() && entry.name.endsWith(extension)) {
        results.push({
          name: entry.name.replace(extension, ''),
          path: path.join(dirPath, entry.name),
          filename: entry.name,
        });
      }
    }

    return results;
  }
}

module.exports = { BaseIdeSetup };

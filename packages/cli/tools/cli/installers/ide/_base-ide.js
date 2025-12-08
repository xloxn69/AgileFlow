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
  }

  /**
   * Set the AgileFlow folder name
   * @param {string} folderName - The AgileFlow folder name
   */
  setAgileflowFolder(folderName) {
    this.agileflowFolder = folderName;
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
      const agileflowPath = path.join(projectDir, this.configDir, 'agileflow');
      if (await fs.pathExists(agileflowPath)) {
        await fs.remove(agileflowPath);
        console.log(chalk.dim(`  Removed old AgileFlow configuration from ${this.displayName}`));
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

/**
 * Shared Counter Module
 *
 * Single source of truth for counting AgileFlow components.
 * Used by: sync-counts.js, content-injector.js, installer.js
 */

const fs = require('fs');
const path = require('path');

/**
 * Count command files in a directory (including subdirectories like session/)
 * @param {string} commandsDir - Path to commands directory
 * @returns {number} Total command count
 */
function countCommands(commandsDir) {
  if (!fs.existsSync(commandsDir)) return 0;

  let count = 0;
  const entries = fs.readdirSync(commandsDir, { withFileTypes: true });

  for (const entry of entries) {
    if (entry.isFile() && entry.name.endsWith('.md')) {
      count++;
    } else if (entry.isDirectory()) {
      // Count commands in subdirectories (e.g., session/)
      const subDir = path.join(commandsDir, entry.name);
      const subFiles = fs.readdirSync(subDir).filter(f => f.endsWith('.md'));
      count += subFiles.length;
    }
  }

  return count;
}

/**
 * Count agent files in a directory
 * @param {string} agentsDir - Path to agents directory
 * @returns {number} Total agent count
 */
function countAgents(agentsDir) {
  if (!fs.existsSync(agentsDir)) return 0;
  return fs.readdirSync(agentsDir).filter(f => f.endsWith('.md')).length;
}

/**
 * Count skill directories (each skill has a SKILL.md file)
 * @param {string} skillsDir - Path to skills directory
 * @returns {number} Total skill count
 */
function countSkills(skillsDir) {
  if (!fs.existsSync(skillsDir)) return 0;

  let count = 0;

  function scanDir(dir) {
    const entries = fs.readdirSync(dir, { withFileTypes: true });
    for (const entry of entries) {
      if (entry.isDirectory()) {
        const skillFile = path.join(dir, entry.name, 'SKILL.md');
        if (fs.existsSync(skillFile)) {
          count++;
        }
        // Recurse into subdirectories
        scanDir(path.join(dir, entry.name));
      }
    }
  }

  scanDir(skillsDir);
  return count;
}

/**
 * Get all counts at once from a core directory
 * @param {string} coreDir - Path to core directory containing commands/, agents/, skills/
 * @returns {Object} Counts object { commands, agents, skills }
 */
function getCounts(coreDir) {
  return {
    commands: countCommands(path.join(coreDir, 'commands')),
    agents: countAgents(path.join(coreDir, 'agents')),
    skills: countSkills(path.join(coreDir, 'skills')),
  };
}

/**
 * Get counts from CLI package source
 * @param {string} cliRoot - Path to packages/cli directory
 * @returns {Object} Counts object { commands, agents, skills }
 */
function getSourceCounts(cliRoot) {
  const coreDir = path.join(cliRoot, 'src', 'core');
  return getCounts(coreDir);
}

module.exports = {
  countCommands,
  countAgents,
  countSkills,
  getCounts,
  getSourceCounts,
};

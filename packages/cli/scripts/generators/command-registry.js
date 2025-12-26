#!/usr/bin/env node

/**
 * Command Registry Scanner
 *
 * Scans commands/ directory and extracts metadata from frontmatter.
 * Returns structured command registry for use in generators.
 */

const fs = require('fs');
const path = require('path');

/**
 * Extract frontmatter from markdown file
 * @param {string} filePath - Path to markdown file
 * @returns {object} Frontmatter object
 */
function extractFrontmatter(filePath) {
  const content = fs.readFileSync(filePath, 'utf-8');
  const frontmatterMatch = content.match(/^---\n([\s\S]*?)\n---/);

  if (!frontmatterMatch) {
    return {};
  }

  const frontmatter = {};
  const lines = frontmatterMatch[1].split('\n');

  for (const line of lines) {
    const match = line.match(/^(\w+):\s*(.+)$/);
    if (match) {
      const [, key, value] = match;
      // Remove quotes if present
      frontmatter[key] = value.replace(/^["']|["']$/g, '');
    }
  }

  return frontmatter;
}

/**
 * Categorize command based on its name/description
 * @param {string} name - Command name
 * @param {string} description - Command description
 * @returns {string} Category name
 */
function categorizeCommand(name, description) {
  const categories = {
    'Story Management': ['story', 'epic', 'assign', 'status'],
    Development: ['verify', 'baseline', 'resume', 'session-init', 'babysit'],
    'Quality & Testing': ['tests', 'review', 'ci'],
    Documentation: ['docs', 'adr', 'readme-sync'],
    'Planning & Metrics': ['sprint', 'velocity', 'metrics', 'board', 'deps'],
    'Research & Strategy': ['research', 'product'],
    'Deployment & Operations': ['deploy', 'packages'],
    Collaboration: ['update', 'handoff', 'feedback', 'retro'],
    Maintenance: ['debt', 'compress', 'template'],
    System: ['setup', 'help', 'diagnose', 'auto', 'agent'],
  };

  for (const [category, keywords] of Object.entries(categories)) {
    if (keywords.some(kw => name.includes(kw))) {
      return category;
    }
  }

  return 'Other';
}

/**
 * Scan commands directory and build registry
 * @param {string} commandsDir - Path to commands directory
 * @returns {Array} Array of command metadata objects
 */
function scanCommands(commandsDir) {
  const commands = [];
  const files = fs.readdirSync(commandsDir);

  for (const file of files) {
    if (!file.endsWith('.md')) continue;

    const filePath = path.join(commandsDir, file);
    const frontmatter = extractFrontmatter(filePath);
    const name = file.replace('.md', '');

    commands.push({
      name,
      file,
      path: filePath,
      description: frontmatter.description || '',
      argumentHint: frontmatter['argument-hint'] || '',
      category: categorizeCommand(name, frontmatter.description || ''),
    });
  }

  // Sort by category, then by name
  commands.sort((a, b) => {
    if (a.category !== b.category) {
      return a.category.localeCompare(b.category);
    }
    return a.name.localeCompare(b.name);
  });

  return commands;
}

/**
 * Main function
 */
function main() {
  const rootDir = path.resolve(__dirname, '../..');
  const commandsDir = path.join(rootDir, 'src/core/commands');

  if (!fs.existsSync(commandsDir)) {
    console.error(`Commands directory not found: ${commandsDir}`);
    process.exit(1);
  }

  const commands = scanCommands(commandsDir);

  // If called directly, output JSON
  if (require.main === module) {
    console.log(JSON.stringify(commands, null, 2));
  }

  return commands;
}

// Export for use in other scripts
module.exports = { scanCommands, extractFrontmatter, categorizeCommand };

// Run if called directly
if (require.main === module) {
  main();
}

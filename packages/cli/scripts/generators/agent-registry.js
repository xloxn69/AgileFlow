#!/usr/bin/env node

/**
 * Agent Registry Scanner
 *
 * Scans agents/ directory and extracts metadata from frontmatter.
 * Returns structured agent registry for use in generators.
 */

const fs = require('fs');
const path = require('path');

/**
 * Extract YAML frontmatter from markdown file
 * Handles multi-line values like tools arrays
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
  let currentKey = null;
  let currentArray = null;

  for (const line of lines) {
    // Handle array items (lines starting with -)
    if (line.trim().startsWith('-')) {
      if (currentArray) {
        currentArray.push(line.trim().substring(1).trim());
      }
      continue;
    }

    // Handle key-value pairs
    const match = line.match(/^(\w+):\s*(.*)$/);
    if (match) {
      const [, key, value] = match;
      currentKey = key;

      // If value is empty, it's likely an array
      if (!value) {
        currentArray = [];
        frontmatter[key] = currentArray;
      } else {
        // Remove quotes if present
        frontmatter[key] = value.replace(/^["']|["']$/g, '');
        currentArray = null;
      }
    }
  }

  return frontmatter;
}

/**
 * Categorize agent based on its role
 * @param {string} name - Agent name
 * @param {string} description - Agent description
 * @returns {string} Category name
 */
function categorizeAgent(name, description) {
  const categories = {
    'Core Development': ['ui', 'api', 'database', 'devops', 'ci'],
    'Specialized Development': ['mobile', 'integrations', 'datamigration'],
    'Quality & Testing': ['qa', 'testing', 'security', 'accessibility'],
    'Architecture & Design': ['design', 'adr-writer', 'epic-planner', 'product'],
    'Maintenance & Optimization': ['refactor', 'performance', 'monitoring'],
    'Documentation & Knowledge': ['documentation', 'readme-updater', 'research'],
    'Compliance & Governance': ['compliance', 'analytics'],
    'Mentorship': ['mentor']
  };

  for (const [category, keywords] of Object.entries(categories)) {
    if (keywords.some(kw => name.includes(kw))) {
      return category;
    }
  }

  return 'Other';
}

/**
 * Scan agents directory and build registry
 * @param {string} agentsDir - Path to agents directory
 * @returns {Array} Array of agent metadata objects
 */
function scanAgents(agentsDir) {
  const agents = [];
  const files = fs.readdirSync(agentsDir);

  for (const file of files) {
    if (!file.endsWith('.md')) continue;

    const filePath = path.join(agentsDir, file);
    const frontmatter = extractFrontmatter(filePath);
    const name = file.replace('.md', '');

    // Parse tools array if it exists
    let tools = [];
    if (frontmatter.tools) {
      if (Array.isArray(frontmatter.tools)) {
        tools = frontmatter.tools;
      } else if (typeof frontmatter.tools === 'string') {
        tools = frontmatter.tools.split(',').map(t => t.trim());
      }
    }

    agents.push({
      name,
      file,
      path: filePath,
      displayName: frontmatter.name || name,
      description: frontmatter.description || '',
      tools,
      model: frontmatter.model || 'haiku',
      color: frontmatter.color || 'blue',
      category: categorizeAgent(name, frontmatter.description || '')
    });
  }

  // Sort by category, then by name
  agents.sort((a, b) => {
    if (a.category !== b.category) {
      return a.category.localeCompare(b.category);
    }
    return a.name.localeCompare(b.name);
  });

  return agents;
}

/**
 * Main function
 */
function main() {
  const rootDir = path.resolve(__dirname, '../..');
  const agentsDir = path.join(rootDir, 'src/core/agents');

  if (!fs.existsSync(agentsDir)) {
    console.error(`Agents directory not found: ${agentsDir}`);
    process.exit(1);
  }

  const agents = scanAgents(agentsDir);

  // If called directly, output JSON
  if (require.main === module) {
    console.log(JSON.stringify(agents, null, 2));
  }

  return agents;
}

// Export for use in other scripts
module.exports = { scanAgents, extractFrontmatter, categorizeAgent };

// Run if called directly
if (require.main === module) {
  main();
}

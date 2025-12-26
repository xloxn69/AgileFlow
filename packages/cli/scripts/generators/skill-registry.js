#!/usr/bin/env node

/**
 * Skill Registry Scanner
 *
 * Scans skills/ directory and extracts metadata from SKILL.md frontmatter.
 * Returns structured skill registry for use in generators.
 */

const fs = require('fs');
const path = require('path');

/**
 * Extract YAML frontmatter from markdown file
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
 * Categorize skill based on its name/description
 * @param {string} name - Skill name
 * @param {string} description - Skill description
 * @returns {string} Category name
 */
function categorizeSkill(name, description) {
  const categories = {
    'Story & Planning': ['story', 'epic', 'sprint', 'acceptance-criteria'],
    'Code Generation': ['type-definitions', 'validation-schema', 'error-handler'],
    Testing: ['test-case'],
    Documentation: ['adr', 'api-documentation', 'changelog', 'pr-description'],
    Architecture: ['sql-schema', 'diagram'],
    Deployment: ['deployment-guide', 'migration-checklist'],
  };

  const lowerName = name.toLowerCase();
  const lowerDesc = description.toLowerCase();

  for (const [category, keywords] of Object.entries(categories)) {
    if (keywords.some(kw => lowerName.includes(kw) || lowerDesc.includes(kw))) {
      return category;
    }
  }

  return 'Other';
}

/**
 * Scan skills directory and build registry
 * @param {string} skillsDir - Path to skills directory
 * @returns {Array} Array of skill metadata objects
 */
function scanSkills(skillsDir) {
  const skills = [];

  // Each skill is in its own directory with a SKILL.md file
  const skillDirs = fs.readdirSync(skillsDir);

  for (const skillDir of skillDirs) {
    const skillPath = path.join(skillsDir, skillDir);

    // Skip if not a directory
    if (!fs.statSync(skillPath).isDirectory()) continue;

    const skillFile = path.join(skillPath, 'SKILL.md');

    // Skip if SKILL.md doesn't exist
    if (!fs.existsSync(skillFile)) continue;

    const frontmatter = extractFrontmatter(skillFile);
    const name = frontmatter.name || skillDir;
    const description = frontmatter.description || '';

    skills.push({
      name,
      directory: skillDir,
      file: 'SKILL.md',
      path: skillFile,
      description,
      category: categorizeSkill(name, description),
    });
  }

  // Sort by category, then by name
  skills.sort((a, b) => {
    if (a.category !== b.category) {
      return a.category.localeCompare(b.category);
    }
    return a.name.localeCompare(b.name);
  });

  return skills;
}

/**
 * Main function
 */
function main() {
  const rootDir = path.resolve(__dirname, '../..');
  const skillsDir = path.join(rootDir, 'src/core/skills');

  if (!fs.existsSync(skillsDir)) {
    console.error(`Skills directory not found: ${skillsDir}`);
    process.exit(1);
  }

  const skills = scanSkills(skillsDir);

  // If called directly, output JSON
  if (require.main === module) {
    console.log(JSON.stringify(skills, null, 2));
  }

  return skills;
}

// Export for use in other scripts
module.exports = { scanSkills, extractFrontmatter, categorizeSkill };

// Run if called directly
if (require.main === module) {
  main();
}

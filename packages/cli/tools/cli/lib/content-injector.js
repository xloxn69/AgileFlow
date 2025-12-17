/**
 * Content Injector - Dynamic content injection for command files
 *
 * Generates agent lists and command lists from source directories
 * and injects them into command files during installation.
 */

const fs = require('fs');
const path = require('path');
const yaml = require('js-yaml');

/**
 * Scan agents directory and generate formatted agent list
 * @param {string} agentsDir - Path to agents directory
 * @returns {string} Formatted agent list
 */
function generateAgentList(agentsDir) {
  const files = fs.readdirSync(agentsDir).filter(f => f.endsWith('.md'));
  const agents = [];

  for (const file of files) {
    const filePath = path.join(agentsDir, file);
    const content = fs.readFileSync(filePath, 'utf8');

    // Extract YAML frontmatter
    const match = content.match(/^---\n([\s\S]*?)\n---/);
    if (!match) continue;

    try {
      const frontmatter = yaml.load(match[1]);

      // Skip if frontmatter is null or not an object
      if (!frontmatter || typeof frontmatter !== 'object') {
        continue;
      }

      // Handle tools field - can be array or string
      let tools = frontmatter.tools || [];
      if (typeof tools === 'string') {
        tools = tools.split(',').map(t => t.trim());
      }

      agents.push({
        name: frontmatter.name || path.basename(file, '.md'),
        description: frontmatter.description || '',
        tools: tools,
        model: frontmatter.model || 'haiku'
      });
    } catch (err) {
      // Silently skip files with parsing errors
      continue;
    }
  }

  // Sort alphabetically by name
  agents.sort((a, b) => a.name.localeCompare(b.name));

  // Generate formatted output
  let output = `**AVAILABLE AGENTS (${agents.length} total)**:\n\n`;

  agents.forEach((agent, index) => {
    output += `${index + 1}. **${agent.name}** (model: ${agent.model})\n`;
    output += `   - **Purpose**: ${agent.description}\n`;
    output += `   - **Tools**: ${agent.tools.join(', ')}\n`;
    output += `   - **Usage**: \`subagent_type: "AgileFlow:${agent.name}"\`\n`;
    output += `\n`;
  });

  return output;
}

/**
 * Scan commands directory and generate formatted command list
 * @param {string} commandsDir - Path to commands directory
 * @returns {string} Formatted command list
 */
function generateCommandList(commandsDir) {
  const files = fs.readdirSync(commandsDir).filter(f => f.endsWith('.md'));
  const commands = [];

  for (const file of files) {
    const filePath = path.join(commandsDir, file);
    const content = fs.readFileSync(filePath, 'utf8');

    // Extract YAML frontmatter
    const match = content.match(/^---\n([\s\S]*?)\n---/);
    if (!match) continue;

    try {
      const frontmatter = yaml.load(match[1]);
      const cmdName = path.basename(file, '.md');

      // Skip if frontmatter is null or not an object
      if (!frontmatter || typeof frontmatter !== 'object') {
        continue;
      }

      commands.push({
        name: cmdName,
        description: frontmatter.description || '',
        argumentHint: frontmatter['argument-hint'] || ''
      });
    } catch (err) {
      // Silently skip files with parsing errors - they might be generated files
      // with content that looks like frontmatter but isn't
      continue;
    }
  }

  // Sort alphabetically by name
  commands.sort((a, b) => a.name.localeCompare(b.name));

  // Generate formatted output
  let output = `Available commands (${commands.length} total):\n`;

  commands.forEach(cmd => {
    const argHint = cmd.argumentHint ? ` ${cmd.argumentHint}` : '';
    output += `- \`/agileflow:${cmd.name}${argHint}\` - ${cmd.description}\n`;
  });

  return output;
}

/**
 * Inject dynamic content into a template file
 * @param {string} templateContent - Template file content with placeholders
 * @param {string} agentsDir - Path to agents directory
 * @param {string} commandsDir - Path to commands directory
 * @returns {string} Content with placeholders replaced
 */
function injectContent(templateContent, agentsDir, commandsDir) {
  let result = templateContent;

  // Replace {{AGENT_LIST}} placeholder
  if (result.includes('{{AGENT_LIST}}')) {
    const agentList = generateAgentList(agentsDir);
    result = result.replace(/<!-- {{AGENT_LIST}} -->/g, agentList);
  }

  // Replace {{COMMAND_LIST}} placeholder
  if (result.includes('{{COMMAND_LIST}}')) {
    const commandList = generateCommandList(commandsDir);
    result = result.replace(/<!-- {{COMMAND_LIST}} -->/g, commandList);
  }

  return result;
}

module.exports = {
  generateAgentList,
  generateCommandList,
  injectContent
};

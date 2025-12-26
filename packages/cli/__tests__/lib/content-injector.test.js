/**
 * Tests for content-injector.js
 *
 * Tests dynamic content injection for command/agent list generation
 */

const fs = require('fs');
const path = require('path');
const os = require('os');

const {
  generateAgentList,
  generateCommandList,
  injectContent,
} = require('../../tools/cli/lib/content-injector');

describe('content-injector', () => {
  let tempDir;

  beforeEach(() => {
    // Create a fresh temp directory for each test
    tempDir = fs.mkdtempSync(path.join(os.tmpdir(), 'content-injector-test-'));
  });

  afterEach(() => {
    // Clean up temp directory
    fs.rmSync(tempDir, { recursive: true, force: true });
  });

  describe('generateAgentList', () => {
    it('generates formatted agent list from directory', () => {
      const agentsDir = path.join(tempDir, 'agents');
      fs.mkdirSync(agentsDir);

      // Create test agent file
      fs.writeFileSync(
        path.join(agentsDir, 'test-agent.md'),
        `---
name: test-agent
description: A test agent for unit testing
tools:
  - Read
  - Write
  - Bash
model: sonnet
---

# Test Agent

Agent content here.
`
      );

      const result = generateAgentList(agentsDir);

      expect(result).toContain('**AVAILABLE AGENTS (1 total)**');
      expect(result).toContain('**test-agent** (model: sonnet)');
      expect(result).toContain('**Purpose**: A test agent for unit testing');
      expect(result).toContain('**Tools**: Read, Write, Bash');
      expect(result).toContain('`subagent_type: "AgileFlow:test-agent"`');
    });

    it('handles multiple agents and sorts alphabetically', () => {
      const agentsDir = path.join(tempDir, 'agents');
      fs.mkdirSync(agentsDir);

      // Create agents with names that would sort differently
      fs.writeFileSync(
        path.join(agentsDir, 'zebra-agent.md'),
        `---
name: zebra-agent
description: Z agent
tools:
  - Read
model: haiku
---
`
      );

      fs.writeFileSync(
        path.join(agentsDir, 'alpha-agent.md'),
        `---
name: alpha-agent
description: A agent
tools:
  - Write
model: opus
---
`
      );

      const result = generateAgentList(agentsDir);

      expect(result).toContain('**AVAILABLE AGENTS (2 total)**');
      // Alpha should come before Zebra
      const alphaIndex = result.indexOf('alpha-agent');
      const zebraIndex = result.indexOf('zebra-agent');
      expect(alphaIndex).toBeLessThan(zebraIndex);
    });

    it('handles tools as comma-separated string', () => {
      const agentsDir = path.join(tempDir, 'agents');
      fs.mkdirSync(agentsDir);

      fs.writeFileSync(
        path.join(agentsDir, 'string-tools.md'),
        `---
name: string-tools
description: Agent with string tools
tools: Read, Write, Edit
model: haiku
---
`
      );

      const result = generateAgentList(agentsDir);

      expect(result).toContain('**Tools**: Read, Write, Edit');
    });

    it('uses defaults for missing fields', () => {
      const agentsDir = path.join(tempDir, 'agents');
      fs.mkdirSync(agentsDir);

      fs.writeFileSync(
        path.join(agentsDir, 'minimal.md'),
        `---
name: minimal
---
`
      );

      const result = generateAgentList(agentsDir);

      expect(result).toContain('**minimal** (model: haiku)');
      expect(result).toContain('**Purpose**: ');
      expect(result).toContain('**Tools**: ');
    });

    it('uses filename as name when name not in frontmatter', () => {
      const agentsDir = path.join(tempDir, 'agents');
      fs.mkdirSync(agentsDir);

      fs.writeFileSync(
        path.join(agentsDir, 'filename-only.md'),
        `---
description: Uses filename as name
---
`
      );

      const result = generateAgentList(agentsDir);

      expect(result).toContain('**filename-only**');
    });

    it('skips files without frontmatter', () => {
      const agentsDir = path.join(tempDir, 'agents');
      fs.mkdirSync(agentsDir);

      fs.writeFileSync(
        path.join(agentsDir, 'no-frontmatter.md'),
        `# No Frontmatter

Just content, no YAML.
`
      );

      fs.writeFileSync(
        path.join(agentsDir, 'valid.md'),
        `---
name: valid-agent
description: Valid agent
tools:
  - Read
---
`
      );

      const result = generateAgentList(agentsDir);

      expect(result).toContain('**AVAILABLE AGENTS (1 total)**');
      expect(result).toContain('valid-agent');
      expect(result).not.toContain('no-frontmatter');
    });

    it('skips files with invalid YAML', () => {
      const agentsDir = path.join(tempDir, 'agents');
      fs.mkdirSync(agentsDir);

      fs.writeFileSync(
        path.join(agentsDir, 'invalid-yaml.md'),
        `---
name: [this is invalid yaml
  broken: structure
---
`
      );

      fs.writeFileSync(
        path.join(agentsDir, 'valid.md'),
        `---
name: valid
description: Valid
---
`
      );

      const result = generateAgentList(agentsDir);

      expect(result).toContain('**AVAILABLE AGENTS (1 total)**');
      expect(result).toContain('valid');
    });

    it('skips non-md files', () => {
      const agentsDir = path.join(tempDir, 'agents');
      fs.mkdirSync(agentsDir);

      fs.writeFileSync(path.join(agentsDir, 'ignore.txt'), 'not markdown');
      fs.writeFileSync(path.join(agentsDir, 'ignore.js'), 'const x = 1;');
      fs.writeFileSync(
        path.join(agentsDir, 'valid.md'),
        `---
name: valid
---
`
      );

      const result = generateAgentList(agentsDir);

      expect(result).toContain('**AVAILABLE AGENTS (1 total)**');
    });

    it('returns empty list for empty directory', () => {
      const agentsDir = path.join(tempDir, 'agents');
      fs.mkdirSync(agentsDir);

      const result = generateAgentList(agentsDir);

      expect(result).toContain('**AVAILABLE AGENTS (0 total)**');
    });

    it('skips files with null frontmatter', () => {
      const agentsDir = path.join(tempDir, 'agents');
      fs.mkdirSync(agentsDir);

      // YAML that parses to null (empty frontmatter)
      fs.writeFileSync(
        path.join(agentsDir, 'null-frontmatter.md'),
        `---
---

Content only
`
      );

      const result = generateAgentList(agentsDir);

      expect(result).toContain('**AVAILABLE AGENTS (0 total)**');
    });
  });

  describe('generateCommandList', () => {
    it('generates formatted command list from directory', () => {
      const commandsDir = path.join(tempDir, 'commands');
      fs.mkdirSync(commandsDir);

      fs.writeFileSync(
        path.join(commandsDir, 'test-command.md'),
        `---
description: A test command
argument-hint: STORY=<id>
---

# Test Command

Command content.
`
      );

      const result = generateCommandList(commandsDir);

      expect(result).toContain('Available commands (1 total)');
      expect(result).toContain('`/agileflow:test-command STORY=<id>`');
      expect(result).toContain('A test command');
    });

    it('handles commands without argument hints', () => {
      const commandsDir = path.join(tempDir, 'commands');
      fs.mkdirSync(commandsDir);

      fs.writeFileSync(
        path.join(commandsDir, 'no-args.md'),
        `---
description: Command without arguments
---
`
      );

      const result = generateCommandList(commandsDir);

      expect(result).toContain('`/agileflow:no-args`');
      expect(result).not.toContain('undefined');
    });

    it('sorts commands alphabetically', () => {
      const commandsDir = path.join(tempDir, 'commands');
      fs.mkdirSync(commandsDir);

      fs.writeFileSync(
        path.join(commandsDir, 'zebra.md'),
        `---
description: Z command
---
`
      );

      fs.writeFileSync(
        path.join(commandsDir, 'alpha.md'),
        `---
description: A command
---
`
      );

      const result = generateCommandList(commandsDir);

      const alphaIndex = result.indexOf('alpha');
      const zebraIndex = result.indexOf('zebra');
      expect(alphaIndex).toBeLessThan(zebraIndex);
    });

    it('skips files without valid frontmatter', () => {
      const commandsDir = path.join(tempDir, 'commands');
      fs.mkdirSync(commandsDir);

      fs.writeFileSync(path.join(commandsDir, 'no-frontmatter.md'), '# Just a heading');

      fs.writeFileSync(
        path.join(commandsDir, 'valid.md'),
        `---
description: Valid command
---
`
      );

      const result = generateCommandList(commandsDir);

      expect(result).toContain('Available commands (1 total)');
      expect(result).toContain('valid');
      expect(result).not.toContain('no-frontmatter');
    });

    it('returns empty list for empty directory', () => {
      const commandsDir = path.join(tempDir, 'commands');
      fs.mkdirSync(commandsDir);

      const result = generateCommandList(commandsDir);

      expect(result).toContain('Available commands (0 total)');
    });
  });

  describe('injectContent', () => {
    it('replaces agent list placeholder', () => {
      const agentsDir = path.join(tempDir, 'agents');
      const commandsDir = path.join(tempDir, 'commands');
      fs.mkdirSync(agentsDir);
      fs.mkdirSync(commandsDir);

      fs.writeFileSync(
        path.join(agentsDir, 'test.md'),
        `---
name: test-agent
description: Test
tools:
  - Read
---
`
      );

      const template = `# Title

{{AGENT_LIST}}

<!-- {{AGENT_LIST}} -->

## Footer
`;

      const result = injectContent(template, agentsDir, commandsDir);

      expect(result).toContain('**AVAILABLE AGENTS (1 total)**');
      expect(result).toContain('test-agent');
      expect(result).not.toContain('<!-- {{AGENT_LIST}} -->');
    });

    it('replaces command list placeholder', () => {
      const agentsDir = path.join(tempDir, 'agents');
      const commandsDir = path.join(tempDir, 'commands');
      fs.mkdirSync(agentsDir);
      fs.mkdirSync(commandsDir);

      fs.writeFileSync(
        path.join(commandsDir, 'status.md'),
        `---
description: Show status
---
`
      );

      const template = `# Commands

{{COMMAND_LIST}}

<!-- {{COMMAND_LIST}} -->

Done.
`;

      const result = injectContent(template, agentsDir, commandsDir);

      expect(result).toContain('Available commands (1 total)');
      expect(result).toContain('/agileflow:status');
      expect(result).not.toContain('<!-- {{COMMAND_LIST}} -->');
    });

    it('replaces both placeholders', () => {
      const agentsDir = path.join(tempDir, 'agents');
      const commandsDir = path.join(tempDir, 'commands');
      fs.mkdirSync(agentsDir);
      fs.mkdirSync(commandsDir);

      fs.writeFileSync(
        path.join(agentsDir, 'agent.md'),
        `---
name: my-agent
description: My agent
tools:
  - Read
---
`
      );

      fs.writeFileSync(
        path.join(commandsDir, 'cmd.md'),
        `---
description: My command
---
`
      );

      const template = `# Both Lists

## Agents
<!-- {{AGENT_LIST}} -->

## Commands
<!-- {{COMMAND_LIST}} -->
`;

      const result = injectContent(template, agentsDir, commandsDir);

      expect(result).toContain('**AVAILABLE AGENTS (1 total)**');
      expect(result).toContain('my-agent');
      expect(result).toContain('Available commands (1 total)');
      expect(result).toContain('/agileflow:cmd');
    });

    it('leaves content unchanged when no placeholders', () => {
      const agentsDir = path.join(tempDir, 'agents');
      const commandsDir = path.join(tempDir, 'commands');
      fs.mkdirSync(agentsDir);
      fs.mkdirSync(commandsDir);

      const template = `# No Placeholders

Just regular content.
`;

      const result = injectContent(template, agentsDir, commandsDir);

      expect(result).toBe(template);
    });

    it('handles multiple occurrences of same placeholder', () => {
      const agentsDir = path.join(tempDir, 'agents');
      const commandsDir = path.join(tempDir, 'commands');
      fs.mkdirSync(agentsDir);
      fs.mkdirSync(commandsDir);

      fs.writeFileSync(
        path.join(agentsDir, 'x.md'),
        `---
name: x
description: X
tools:
  - Read
---
`
      );

      const template = `First: <!-- {{AGENT_LIST}} -->

Second: <!-- {{AGENT_LIST}} -->
`;

      const result = injectContent(template, agentsDir, commandsDir);

      // Both should be replaced
      const matches = result.match(/\*\*AVAILABLE AGENTS/g);
      expect(matches).toHaveLength(2);
    });
  });
});

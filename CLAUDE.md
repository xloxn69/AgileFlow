# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Repository Overview

**AgileFlow** is a Claude Code plugin providing a universal agile/docs-as-code system. It's a **command pack** (41 slash commands + 8 subagents), not a traditional application codebase. There is no build step, runtime, or deployment process.

## Architecture

### Plugin Structure

```
AgileFlow/
├── .claude-plugin/
│   ├── plugin.json           # Plugin metadata (version, command/subagent registry)
│   └── marketplace.json      # Marketplace listing
├── commands/                 # 41 slash command definitions (*.md files)
├── agents/                   # 8 subagent definitions (*.md files)
├── templates/                # Document templates for epics, stories, ADRs
├── CHANGELOG.md             # Version history (Keep a Changelog format)
├── README.md                # Plugin documentation
├── SUBAGENTS.md             # Subagent usage guide
├── .mcp.json.example        # MCP server config template (Notion, Supabase)
└── .env.example             # Environment variable template
```

### Key Concepts

**Slash Commands** (`/command-name`):
- Defined in `commands/*.md` files
- Each file contains a prompt executed when user runs the command
- Commands are stateless, single-purpose actions
- Registered in `.claude-plugin/plugin.json` under `"commands"` array

**Subagents** (invoked via "Use the X subagent to..."):
- Defined in `agents/*.md` files with YAML frontmatter
- Run in separate context windows for focused work
- Have specialized expertise (UI, API, CI, DevOps, planning, research, mentoring)
- Registered in `.claude-plugin/plugin.json` under `"agents"` array

**AgileFlow System** (created by `/setup-system` command):
- **Not part of this repository** - created in user's project repos
- Scaffolds `docs/` directory structure (00-meta through 10-research)
- Manages epics, stories, ADRs, agent status, message bus
- All commands operate on this docs structure

### Critical Files

**`.claude-plugin/plugin.json`** - Source of truth for:
- Plugin version number (semantic versioning)
- Command registry (file paths to `commands/*.md`)
- Subagent registry (file paths to `agents/*.md`)

**`.claude-plugin/marketplace.json`** - Marketplace metadata:
- Plugin name and owner
- Version description (shown in `/plugin` UI)
- Must stay in sync with `plugin.json` version

**`CHANGELOG.md`** - Version history:
- Follows Keep a Changelog format
- Latest version section must match `plugin.json` version
- Documents all changes per version with Added/Changed/Fixed/Improved sections

## Common Development Tasks

### Updating Plugin Version

When releasing a new version (example: v2.3.1 → v2.3.2):

1. **Update version files**:
   ```bash
   # Edit these 3 files to bump version
   .claude-plugin/plugin.json       # "version": "2.3.2"
   .claude-plugin/marketplace.json  # Update description with version
   CHANGELOG.md                     # Add new [2.3.2] section at top
   ```

2. **Commit changes**:
   ```bash
   git add .claude-plugin/plugin.json .claude-plugin/marketplace.json CHANGELOG.md
   git commit -m "chore: bump version to v2.3.2"
   ```

3. **Verify**:
   ```bash
   # Check all 3 files have matching version
   grep -n "2.3.2" .claude-plugin/plugin.json .claude-plugin/marketplace.json CHANGELOG.md
   ```

### Adding a New Command

1. **Create command file**:
   ```bash
   # Add to commands/ directory
   commands/new-command.md
   ```

2. **Register in plugin.json**:
   ```json
   {
     "commands": [
       "./commands/existing-command.md",
       "./commands/new-command.md"  // Add here
     ]
   }
   ```

3. **Update README.md** - Add command to appropriate section

4. **Update CHANGELOG.md** - Document under "Added" section

### Adding a New Subagent

1. **Create subagent file** with YAML frontmatter:
   ```bash
   agents/agileflow-newagent.md
   ```

2. **Register in plugin.json**:
   ```json
   {
     "agents": [
       "./agents/agileflow-ui.md",
       "./agents/agileflow-newagent.md"  // Add here
     ]
   }
   ```

3. **Update README.md** and **SUBAGENTS.md** - Document new subagent

4. **Update CHANGELOG.md** - Document under "Added" section

### Modifying Commands or Subagents

- **Command/subagent behavior** is defined in the `.md` file content (the prompt)
- **No build step required** - changes are live when plugin reloads
- **Test changes** by running the command or invoking the subagent in a test project

## MCP Integration

AgileFlow integrates with external services via Model Context Protocol (MCP):

**`.mcp.json.example`** - Template committed to git:
- Configures MCP servers (Notion, Supabase, etc.)
- Uses environment variable substitution: `${NOTION_TOKEN}`
- Users copy to `.mcp.json` (gitignored) and add their tokens to `.env`

**`.env.example`** - Environment variable template:
- Documents required tokens (NOTION_TOKEN, SUPABASE_*, GITHUB_*)
- Never contains actual secrets
- Users copy to `.env` (gitignored) for local development

**Key principle**: Templates are committed, actual configs/tokens are gitignored.

## Documentation Standards

### Command File Format

Commands are markdown files with:
- Heading (command name)
- Description
- Prompt section defining behavior
- Examples (if applicable)
- Technical notes (if applicable)

### Subagent File Format

Subagents are markdown files with:
- YAML frontmatter (name, description, tools)
- Role and objective
- Knowledge sources
- Constraints and quality checklist
- Communication protocols

### Version Updates

When updating CHANGELOG.md:
- Follow Keep a Changelog format strictly
- Use categories: Added, Changed, Fixed, Improved, Technical
- Include date in ISO format (YYYY-MM-DD)
- Add detailed context for changes (not just "fixed bug")

## Git Workflow

**Branches**:
- `main` - stable releases
- Feature branches - for development

**Commits**:
- Use Conventional Commits format
- Example: `feat: add /new-command for X`, `fix: correct version in marketplace.json`
- Include co-authorship: `Co-Authored-By: Claude <noreply@anthropic.com>`

**Never commit**:
- `.mcp.json` (gitignored - contains token references)
- `.env` (gitignored - contains actual secrets)

**Always commit**:
- `.mcp.json.example` (template for team)
- `.env.example` (template with placeholder values)

## Important Notes

### This is a Plugin, Not an Application

- **No package.json** - Not a Node.js project
- **No build process** - Markdown files are the source and distribution
- **No tests** (in the traditional sense) - Validation happens through usage
- **No runtime** - Commands execute within Claude Code context

### User Projects vs Plugin Repository

The AgileFlow plugin **creates structure in user projects** (`docs/` directories, templates, status files) but this repository only contains:
- Command definitions that create/manage those files
- Subagent definitions that operate on those files
- Templates used to scaffold new files

### Version Sync is Critical

**Three files must always have matching versions**:
1. `.claude-plugin/plugin.json` → `"version"`
2. `.claude-plugin/marketplace.json` → `"description"` (mentions version)
3. `CHANGELOG.md` → Top-most `[X.Y.Z]` section

**When releasing**, update all three in the same commit.

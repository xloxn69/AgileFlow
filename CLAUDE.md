# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

---

## ⚠️ CRITICAL: Version Management

**ALWAYS update versions in these 3 files together when making ANY release:**
1. `.claude-plugin/plugin.json` → `"version": "X.Y.Z"`
2. `.claude-plugin/marketplace.json` → `"description"` (mentions version)
3. `CHANGELOG.md` → Add new `[X.Y.Z]` section at top

**Never update just one or two files** - they must always stay in sync.

**ALWAYS PUSH TO GITHUB IMMEDIATELY AFTER COMMITTING** - The marketplace reads from GitHub, not local files. Unpushed commits mean users see the old version.

See "Updating Plugin Version" section below for detailed steps.

---

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
├── .mcp.json.example        # MCP server config template (GitHub, Notion, Supabase)
└── .env.example             # Environment variable template
```

### Key Concepts

**Slash Commands** (`/command-name`):
- Defined in `commands/*.md` files
- Each file contains a prompt executed when user runs the command
- Commands are stateless, single-purpose actions
- **Auto-discovered** from `commands/` directory (no manual registration needed)

**Subagents** (invoked via "Use the X subagent to..."):
- Defined in `agents/*.md` files with YAML frontmatter (name, description, tools, model, color)
- Run in separate context windows for focused work
- Have specialized expertise (UI, API, CI, DevOps, planning, research, mentoring, documentation)
- **Auto-discovered** from `agents/` directory (no manual registration needed)

**Skills** (auto-loaded based on context):
- Defined in `skills/*/SKILL.md` files
- Activate automatically based on keywords in user messages
- Provide specialized capabilities (story writing, commit messages, ADRs, acceptance criteria, etc.)
- **Auto-discovered** from `skills/` directory (no manual registration needed)

**AgileFlow System** (created by `/AgileFlow:setup-system` command):
- **Not part of this repository** - created in user's project repos
- Scaffolds `docs/` directory structure (00-meta through 10-research)
- Manages epics, stories, ADRs, agent status, message bus
- All commands operate on this docs structure

### Critical Files

**`.claude-plugin/plugin.json`** - Plugin metadata (minimal, clean format):
```json
{
  "name": "AgileFlow",
  "version": "X.Y.Z",
  "description": "...",
  "author": { "name": "AgileFlow Contributors" },
  "homepage": "https://github.com/xloxn69/AgileFlow"
}
```
- Commands, agents, and skills are **auto-discovered** from directory structure
- Version number is the single source of truth for releases
- No manual registry maintenance needed

**`.claude-plugin/marketplace.json`** - Marketplace metadata:
- Plugin name and owner
- Version description (shown in plugin UI)
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

3. **Push immediately** (CRITICAL - marketplace reads from GitHub):
   ```bash
   git push origin main
   ```

4. **Verify**:
   ```bash
   # Check all 3 files have matching version
   grep -n "2.3.2" .claude-plugin/plugin.json .claude-plugin/marketplace.json CHANGELOG.md
   ```

### Adding a New Command

1. **Create command file** (auto-discovered):
   ```bash
   # Add to commands/ directory with descriptive name
   commands/new-command.md
   ```

   **Frontmatter format** (optional but recommended):
   ```yaml
   ---
   description: Brief description of what command does
   argument-hint: Optional description of arguments
   ---
   ```

2. **Update README.md** - Add command to appropriate section with `/AgileFlow:` prefix

3. **Bump version and update changelog**:
   - Update `.claude-plugin/plugin.json` version (e.g., 2.15.1 → 2.15.2)
   - Update `.claude-plugin/marketplace.json` description with new version
   - Add new section to `CHANGELOG.md` documenting the new command under "Added"

4. **No need to edit plugin.json** - Auto-discovery handles registration

### Adding a New Subagent

1. **Create subagent file** (auto-discovered):
   ```bash
   agents/agileflow-newagent.md
   ```

2. **Frontmatter requirements**:
   ```yaml
   ---
   name: agileflow-newagent
   description: What this agent does and when to use it
   tools: Read, Write, Edit, Bash, Glob, Grep
   model: haiku  # or sonnet for complex agents
   color: blue   # Choose a color (optional)
   ---
   ```

3. **Update README.md** and **SUBAGENTS.md** - Document new subagent

4. **Bump version and update changelog**:
   - Update `.claude-plugin/plugin.json` version (e.g., 2.15.1 → 2.15.2)
   - Update `.claude-plugin/marketplace.json` description with new version
   - Add new section to `CHANGELOG.md` documenting the new subagent under "Added"

5. **No need to edit plugin.json** - Auto-discovery handles registration

**Model Selection Guide**:
- `model: sonnet` - For complex agents requiring reasoning (mentor, epic-planner)
- `model: haiku` - For specialized but straightforward agents (UI, API, CI, DevOps, research)

### Modifying Commands or Subagents

- **Command/subagent behavior** is defined in the `.md` file content (the prompt)
- **No build step required** - changes are live when plugin reloads
- **Test changes** by running the command or invoking the subagent in a test project
- **For bug fixes or improvements**: Bump version (patch for fixes, minor for improvements) and update all 3 version files

## MCP Integration

AgileFlow integrates with external services via Model Context Protocol (MCP):

**`.mcp.json.example`** - Template committed to git:
- Configures MCP servers for GitHub, Notion, and Supabase integrations
- Uses `${VAR}` syntax for environment variable substitution
- Example: `"GITHUB_PERSONAL_ACCESS_TOKEN": "${GITHUB_PERSONAL_ACCESS_TOKEN}"`
- Users copy to `.mcp.json` (gitignored) - do NOT modify, it reads from .env
- **Why MCP?** Standardized tool interface, no sudo required, better portability

**⚠️ CRITICAL: Environment Variable Security (NOT Hardcoded Tokens)**:
- ✅ `.mcp.json` uses `${VAR}` syntax to read from `.env`
- ✅ Actual tokens stored in `.env` (NOT in `.mcp.json`)
- ✅ BOTH `.mcp.json` AND `.env` MUST be gitignored
- ✅ Commit `.mcp.json.example` and `.env.example` (templates with `${VAR}` syntax)
- ❌ NEVER hardcode tokens in `.mcp.json`
- ❌ NEVER commit `.mcp.json` or `.env` to git
- ⚠️ Each team member needs their own tokens (NO SHARING)

**Supported MCP Servers**:
- **GitHub MCP** (`@modelcontextprotocol/server-github`):
  - Bidirectional GitHub Issues sync
  - No sudo required (uses npx)
  - Token: GitHub Personal Access Token (ghp_*) in `.env`
  - Permissions: `repo`, `read:org`
  - Command: `/AgileFlow:github-sync`
  - Supports `${VAR}` substitution: ✅

- **Notion MCP** (`@notionhq/notion-mcp-server`):
  - Bidirectional Notion database sync
  - Token: Notion Integration Token (ntn_*) in `.env`
  - Command: `/AgileFlow:notion-export`
  - Supports `${VAR}` substitution: ✅

- **Postgres MCP** (example of server WITHOUT `${VAR}` support):
  - Requires wrapper script (see `templates/mcp-wrapper-postgres.sh`)
  - Wrapper loads `.env` and passes credentials as CLI args
  - See `templates/MCP-WRAPPER-SCRIPTS.md` for guide

**`.env.example`** - Environment variable template:
- Documents ALL MCP tokens with placeholders
- CRITICAL: `GITHUB_PERSONAL_ACCESS_TOKEN`, `NOTION_TOKEN`, etc.
- Users copy to `.env` and replace placeholders with real tokens
- `.env` MUST be gitignored (contains actual secrets)

**Setup Flow (NEW - Secure Approach)**:
1. User runs `/AgileFlow:setup-system` → Creates `.mcp.json.example` and `.env.example` with `${VAR}` syntax
2. User copies templates:
   ```bash
   cp .mcp.json.example .mcp.json
   cp .env.example .env
   ```
3. User edits `.env` (NOT `.mcp.json`) and adds real tokens:
   ```bash
   GITHUB_PERSONAL_ACCESS_TOKEN=ghp_actual_token_here
   NOTION_TOKEN=ntn_actual_token_here
   ```
4. User verifies `.mcp.json` and `.env` are in `.gitignore`:
   ```bash
   grep -E '\\.mcp\\.json|\\.env' .gitignore
   ```
5. User restarts Claude Code (to load MCP servers with env vars)
6. User runs `/AgileFlow:github-sync` or `/AgileFlow:notion-export` to sync

**Key principles**:
- `.mcp.json.example` (template with `${VAR}`) → committed to git
- `.mcp.json` (copy of template, unchanged) → gitignored
- `.env.example` (template with placeholders) → committed to git
- `.env` (actual tokens) → gitignored (CRITICAL)
- Tokens ONLY in `.env`, NEVER in `.mcp.json`

**Wrapper Scripts (for servers without `${VAR}` support)**:
- Some MCP servers don't support `${VAR}` substitution
- Use bash wrapper scripts that load `.env` and pass credentials
- See `templates/mcp-wrapper-postgres.sh` for example
- See `templates/MCP-WRAPPER-SCRIPTS.md` for full guide

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
- Example: `feat: add /AgileFlow:new-command for X`, `fix: correct version in marketplace.json`
- Include co-authorship: `Co-Authored-By: Claude <noreply@anthropic.com>`
- **ALWAYS PUSH AFTER COMMITTING**: `git push origin main` (marketplace reads from GitHub)

**Never commit**:
- `.mcp.json` (gitignored - even though it uses `${VAR}`, keep gitignored as safety measure)
- `.env` (gitignored - contains actual secrets/tokens)

**Always commit**:
- `.mcp.json.example` (template with `${VAR}` syntax for team)
- `.env.example` (template with placeholder values)

**Critical reminder**: The plugin marketplace fetches from GitHub, not local files. If you don't push, users won't see your changes!

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

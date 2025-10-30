---
description: notion
allowed-tools: Bash, Read, Edit, Write, Glob, Grep
---

# notion

Export AgileFlow epics, stories, and ADRs to Notion with detailed summaries via Model Context Protocol (MCP).

**Key Feature**: Automatically generates comprehensive summaries for EVERY epic, story, and ADR exported to Notion, including full content, metadata, relationships, and progress tracking.

## Prompt

ROLE: Notion Integration Agent (MCP-based)

OBJECTIVE
Bidirectional sync between AgileFlow markdown docs and Notion databases using Model Context Protocol. **Automatically generates detailed summaries for ALL epics, stories, and ADRs** during export, ensuring complete context is available in Notion. Supports initial setup, export with summaries, import, and incremental sync.

**CRITICAL**: Every item exported to Notion includes a comprehensive summary with:
- Full content from markdown files (descriptions, acceptance criteria, technical notes, etc.)
- Metadata (status, dates, owners, estimates)
- Relationships (epic-story links, related ADRs)
- Progress tracking (for epics: story completion percentage)

This ensures Notion serves as a complete, searchable knowledge base for stakeholders and team members.

---

## PREREQUISITES

### 1. Notion Integration Token

**CRITICAL**: You need a Notion API token before using this command.

```bash
# Create integration at https://www.notion.so/my-integrations
# 1. Click "New integration"
# 2. Give it a name (e.g., "AgileFlow")
# 3. Copy the "Internal Integration Token" (starts with secret_)
# 4. Share your databases with this integration
```

### 2. Environment Setup

**CRITICAL**: Add your token to .env (gitignored, never commit):

```bash
# Add to .env file in project root
echo "NOTION_TOKEN=secret_your_token_here" >> .env

# Verify .env is in .gitignore
grep -q "^\.env$" .gitignore || echo ".env" >> .gitignore
```

### 3. MCP Server Configuration

**CRITICAL**: MCP config must be in PROJECT ROOT (.mcp.json):

```bash
# Check if MCP is configured
cat .mcp.json 2>/dev/null || echo "MCP not configured"

# If missing, run setup
/AgileFlow:setup-system
# Select "yes" for Notion integration
```

Your `.mcp.json` should contain:
```json
{
  "mcpServers": {
    "notion": {
      "command": "npx",
      "args": ["-y", "@notionhq/notion-mcp-server"],
      "env": {
        "NOTION_TOKEN": "${NOTION_TOKEN}"
      }
    }
  }
}
```

**IMPORTANT**:
- .mcp.json must be in **project root** (not ~/.claude-code/ or ~/.config/)
- Uses `@notionhq/notion-mcp-server` package (NOT mcp-remote)
- Token referenced via `${NOTION_TOKEN}` from .env
- .mcp.json should be gitignored
- .mcp.json.example committed as template for teams

### 4. Restart Claude Code

**CRITICAL**: MCP servers only load on startup:

```bash
# After creating/updating .mcp.json, restart Claude Code
# Tools will be available as mcp__notion__* after restart
```

### 5. Database Setup (First Time Only)

Run this command with `MODE=setup` to create the three required databases:

```bash
/AgileFlow:notion MODE=setup
```

This will:
- Use MCP tools to create **AgileFlow Epics** database
- Create **AgileFlow Stories** database
- Create **AgileFlow ADRs** database
- Store database IDs in `docs/08-project/notion-sync-map.json`

---

## USAGE

```bash
# Initial setup (create databases)
/AgileFlow:notion MODE=setup

# Preview export without writing to Notion
# Shows detailed summaries that will be created for each item
/AgileFlow:notion DRY_RUN=true

# Export all docs to Notion WITH DETAILED SUMMARIES
# Automatically generates comprehensive summaries for ALL epics, stories, and ADRs
/AgileFlow:notion

# Export specific type only (with summaries)
/AgileFlow:notion TYPE=epics      # Exports all epics with full content summaries
/AgileFlow:notion TYPE=stories    # Exports all stories with AC, notes, testing strategy
/AgileFlow:notion TYPE=adrs       # Exports all ADRs with context, decisions, consequences

# Import from Notion back to markdown
/AgileFlow:notion MODE=import

# Bidirectional sync (smart merge)
/AgileFlow:notion MODE=sync

# Force overwrite (export wins - includes updated summaries)
/AgileFlow:notion MODE=export FORCE=true

# Force overwrite (import wins)
/AgileFlow:notion MODE=import FORCE=true
```

**Note on Summaries**: Every export automatically includes detailed summaries. You don't need any special flags - summaries are generated for ALL items by default.

### Environment Variables

- `MODE`: `setup` | `export` | `import` | `sync` (default: export)
- `TYPE`: `epics` | `stories` | `adrs` | `all` (default: all)
- `DRY_RUN`: `true` | `false` (default: false) - Preview only
- `FORCE`: `true` | `false` (default: false) - Overwrite without merge

---

## MCP TOOLS REFERENCE

This command uses the following Notion MCP tools (via @notionhq/notion-mcp-server):

### Database Operations
- **mcp__notion__create_database** - Create AgileFlow databases during setup
- **mcp__notion__update_database** - Modify database properties
- **mcp__notion__query_database** - Read database structure and pages

### Page Management
- **mcp__notion__create_page** - Export stories/epics/ADRs to Notion
- **mcp__notion__update_page** - Sync changes back to existing pages
- **mcp__notion__retrieve_page** - Read page content for import

### Search & Retrieval
- **mcp__notion__search** - Find existing AgileFlow databases
- **mcp__notion__retrieve_block_children** - Read page content blocks

---

## ARCHITECTURE

### File Structure

```
docs/08-project/
├── notion-sync-map.json    # Database IDs and sync state
└── notion-sync-log.jsonl   # Audit trail (created on first sync)
```

### Sync Map Schema

```json
{
  "last_sync": "2025-01-15T10:30:00Z",
  "databases": {
    "epics": "notion-database-id-1",
    "stories": "notion-database-id-2",
    "adrs": "notion-database-id-3"
  },
  "pages": {
    "docs/05-epics/AG-001-authentication.md": {
      "notion_id": "page-id-1",
      "last_synced": "2025-01-15T10:30:00Z",
      "checksum": "abc123def456"
    },
    "docs/06-stories/AG-API-001-login-endpoint.md": {
      "notion_id": "page-id-2",
      "last_synced": "2025-01-15T10:30:00Z",
      "checksum": "xyz789uvw012"
    }
  },
  "config": {
    "auto_sync": false,
    "conflict_resolution": "manual",
    "workspace_url": "https://www.notion.so/your-workspace"
  }
}
```

---

## IMPLEMENTATION

### Key Features

**1. Detailed Summary Generation**

For EVERY epic, story, and ADR exported to Notion, the command automatically generates a comprehensive summary that includes:

**Epics**:
- Epic ID and title
- Description (full text)
- Goals and objectives
- All linked stories with their status
- Progress percentage (completed vs total stories)
- Key dates (created, updated)
- Dependencies
- Related ADRs

**Stories**:
- Story ID and title
- Epic parent (linked)
- Description and acceptance criteria (full text)
- Status, priority, estimate
- Owner/assignee
- Technical notes
- Testing strategy
- All files modified (from implementation)
- Dependencies
- Created/updated dates

**ADRs (Architecture Decision Records)**:
- ADR ID and title
- Status (proposed, accepted, superseded)
- Context (why this decision was needed)
- Decision (what was decided)
- Consequences (positive and negative)
- Alternatives considered
- Related epics/stories
- Created/updated dates

**Why Detailed Summaries?**
- Notion pages are searchable - full content makes finding information easier
- Team members can review details without switching to markdown files
- Stakeholders can read complete context in Notion
- Better integration with Notion's AI features (Q&A, summarization)
- Preserves all critical information even if markdown files are updated

**How It Works**:
1. Command reads each markdown file (epic/story/ADR)
2. Extracts frontmatter metadata (YAML)
3. Parses markdown content sections
4. Builds comprehensive summary with all relevant details
5. Creates/updates Notion page with summary as page content
6. Links related items (epic ↔ stories, ADR ↔ epics)

### Export Process

```bash
# For each file type (epics, stories, ADRs):
# 1. Find all markdown files in docs/05-epics/, docs/06-stories/, docs/03-decisions/
# 2. Read file content and parse frontmatter
# 3. Extract all sections (Description, AC, Technical Notes, etc.)
# 4. Generate detailed summary with full content
# 5. Check if page exists in Notion (via sync map)
# 6. Create new page OR update existing page with summary
# 7. Update sync map with page ID and checksum
# 8. Link related items (epic-story relationships, etc.)
```

### Summary Format Example

**Epic Summary in Notion**:
```
📋 Epic: EP-0001 - User Authentication System

Status: In Progress (3/5 stories completed)
Created: 2025-01-15
Updated: 2025-01-20

## Description
[Full description from markdown file]

## Goals
- Enable secure user login
- Support password reset
- Implement session management

## Stories (5 total, 3 completed)
✅ US-0001: User Login API
✅ US-0002: Password Reset Flow
✅ US-0003: Session Token Management
🔄 US-0004: OAuth Integration
📝 US-0005: Multi-Factor Authentication

## Dependencies
- Depends on: None
- Blocks: EP-0002 (User Profile Management)

## Related ADRs
- ADR-0001: JWT vs Session-based Auth (Accepted)
- ADR-0002: Password Hashing Strategy (Accepted)
```

### Implementation Details

The command uses MCP tools to interact with Notion:

**Setup Phase** (MODE=setup):
- Use `mcp__notion__create_database` to create three databases
- Store database IDs in `docs/08-project/notion-sync-map.json`

**Export Phase** (default):
- Use `mcp__notion__query_database` to find existing pages
- Use `mcp__notion__create_page` for new items with full summary
- Use `mcp__notion__update_page` for existing items with updated summary
- All summaries include complete content from markdown files

**Import Phase** (MODE=import):
- Use `mcp__notion__retrieve_page` to read Notion page content
- Parse Notion blocks back to markdown format
- Update local markdown files with changes

**Sync Phase** (MODE=sync):
- Compare checksums between local and Notion
- Detect conflicts (both changed since last sync)
- Offer merge strategies or manual resolution

### Parallel Execution Architecture

**🚀 NEW: Parallel Export with Specialized Agents**

The `/AgileFlow:notion` command now uses parallel agent execution for significantly faster exports:

**How It Works**:
1. **Scan Phase**: Main command scans `docs/` for all epics, stories, and ADRs
2. **Spawn Phase**: Spawns one `agileflow-notion-exporter` agent per item
3. **Parallel Execution**: All agents run simultaneously (haiku model for speed)
4. **Collection Phase**: Collect results from all agents
5. **Sync Map Update**: Update `notion-sync-map.json` with all page IDs

**Performance**:
- **Sequential (old)**: ~2-3 seconds per item = 100 items in 3-5 minutes
- **Parallel (new)**: All items processed simultaneously = 100 items in 10-30 seconds

**Batching for Rate Limits**:
- Notion API has rate limits (~3 requests/second)
- Command batches agents in groups of 10
- Batch 1: Items 1-10 (spawn, wait for completion)
- Batch 2: Items 11-20 (spawn, wait for completion)
- etc.

**Agent Specification**:
- **Agent**: `agileflow-notion-exporter`
- **Model**: haiku (fast for summarization)
- **Tools**: Read, Bash (+ MCP tools automatically available)
- **Input**: item_path, item_type, database_id, dry_run flag
- **Output**: JSON with page_id, status, checksum

**Error Handling**:
- If agent fails: Logged and reported, other agents continue
- After all batches complete: Report failed items for retry
- Partial success: Update sync map for successful items only

**Progress Tracking**:
```
📤 Exporting to Notion...

   Batch 1/5 (items 1-10):
   ✅ EP-0001-authentication.md → Notion
   ✅ EP-0002-authorization.md → Notion
   ...
   Batch 1 complete: 10/10 successful

   Batch 2/5 (items 11-20):
   ✅ US-0001-login-api.md → Notion
   ❌ US-0002-logout-api.md → Error: Rate limit
   ...
   Batch 2 complete: 9/10 successful

   ...

   📊 Export Summary:
   ✅ Successful: 48/50 items
   ❌ Failed: 2/50 items
   ⏱️  Time: 25 seconds
```

**DRY_RUN with Parallel Agents**:
- Each agent generates summary but doesn't export
- Shows what WOULD be created in Notion
- Validates file parsing and summary generation
- No API calls made (fast preview)

**Example Orchestration Flow**:

```bash
# Main command execution
/AgileFlow:notion

# 1. Scan docs/ for all items
Found 50 items: 10 epics, 35 stories, 5 ADRs

# 2. Load database IDs from sync map
Epics DB: abc123
Stories DB: def456
ADRs DB: ghi789

# 3. Spawn agents in batches of 10
Spawning batch 1 (10 agents)...
  → agileflow-notion-exporter (EP-0001)
  → agileflow-notion-exporter (EP-0002)
  → agileflow-notion-exporter (US-0001)
  ...

# 4. Wait for batch completion
Batch 1: 10/10 complete (8 seconds)

# 5. Spawn next batch
Spawning batch 2 (10 agents)...
  ...

# 6. Collect all results
Collected 50 results: 48 success, 2 failed

# 7. Update sync map
Updated notion-sync-map.json with 48 page IDs

# 8. Report summary
✅ Export complete: 48/50 items (96% success rate)
```

---

## EXAMPLE WORKFLOWS

### First-Time Setup

```bash
# 1. Create Notion integration
# Visit https://www.notion.so/my-integrations
# Create new integration, copy token

# 2. Add token to .env
echo "NOTION_TOKEN=secret_your_token_here" >> .env

# 3. Run system setup
/AgileFlow:setup-system
# Select "yes" for Notion integration
# This creates .mcp.json.example and copies to .mcp.json

# 4. Restart Claude Code
# MCP server loads on startup

# 5. Create databases
/AgileFlow:notion MODE=setup

# 6. Share databases with integration
# In Notion: Click "..." → "Add connections" → Select your integration

# 7. Preview export
/AgileFlow:notion DRY_RUN=true

# 8. Perform initial export
/AgileFlow:notion

# 9. Visit Notion to verify
# Open https://notion.so/your-workspace
```

### Daily Workflow

```bash
# Export new/changed docs to Notion
/AgileFlow:notion

# Or just export stories
/AgileFlow:notion TYPE=stories

# Import changes from Notion (team members edited in Notion)
/AgileFlow:notion MODE=import

# Bidirectional sync (smart merge)
/AgileFlow:notion MODE=sync
```

### Team Member Onboarding

```bash
# 1. Pull latest code (includes .mcp.json.example)
git pull

# 2. Create their own Notion integration
# Visit https://www.notion.so/my-integrations

# 3. Copy template to active config
cp .mcp.json.example .mcp.json

# 4. Add their token to .env
echo "NOTION_TOKEN=secret_their_token_here" >> .env

# 5. Restart Claude Code

# 6. Share databases with their integration
# In Notion: Click "..." → "Add connections" → Select their integration

# 7. Start syncing!
/AgileFlow:notion
```

### Conflict Resolution

```bash
# Check for conflicts first
/AgileFlow:notion MODE=sync DRY_RUN=true

# Manual conflict resolution (default)
# Script will list conflicts and prompt for each

# Or force local version to win
/AgileFlow:notion MODE=export FORCE=true

# Or force Notion version to win
/AgileFlow:notion MODE=import FORCE=true
```

---

## ADVANTAGES OF MCP APPROACH

### 🚀 Developer Experience
- ✅ **Standardized tool interface** - MCP provides unified API across services
- ✅ **Better error handling** - Improved over raw Notion API calls
- ✅ **Automatic rate limiting** - MCP handles throttling
- ✅ **Native Claude Code integration** - Tools available as mcp__notion__*

### 👥 Team Collaboration
- ✅ **Template-based setup** - .mcp.json.example committed to git
- ✅ **Individual tokens** - Each team member uses their own NOTION_TOKEN
- ✅ **No token sharing** - Tokens stay in .env (gitignored)
- ✅ **Consistent setup** - Same .mcp.json template for everyone

### 🔒 Security
- ✅ **Tokens in .env** - Gitignored, never committed
- ✅ **Project-level config** - .mcp.json in repo root (not user-level)
- ✅ **Easy revocation** - Just delete token from Notion integrations page

### 🛠️ Maintenance
- ✅ **Standard protocol** - MCP is consistent across tools
- ✅ **Better debugging** - Clearer error messages from MCP tools
- ✅ **No API version pinning** - MCP package handles compatibility

### ⚡ Parallel Execution (NEW in v2.19.3)
- ✅ **10-30x faster exports** - Process 100 items in 10-30 seconds instead of 3-5 minutes
- ✅ **Parallel agent architecture** - One `agileflow-notion-exporter` agent per item
- ✅ **Haiku model for speed** - Fast summarization without sacrificing quality
- ✅ **Batched rate limiting** - Respects Notion API limits with automatic batching
- ✅ **Resilient error handling** - Failed items don't block successful exports
- ✅ **Detailed progress tracking** - See real-time batch completion status
- ✅ **Scalable architecture** - Handles 10 items or 1000 items efficiently

---

## MIGRATION FROM DIRECT API APPROACH

If you previously used direct Notion API calls (curl-based):

### Step 1: Backup

```bash
# Backup your sync map (database IDs are preserved!)
cp docs/08-project/notion-sync-map.json docs/08-project/notion-sync-map.json.backup
```

### Step 2: Set Up MCP

```bash
# Your NOTION_TOKEN can stay in .env (no change needed!)

# Run setup to create .mcp.json
/AgileFlow:setup-system
# Select "yes" for Notion integration

# This creates .mcp.json with:
# {
#   "mcpServers": {
#     "notion": {
#       "command": "npx",
#       "args": ["-y", "@notionhq/notion-mcp-server"],
#       "env": {
#         "NOTION_TOKEN": "${NOTION_TOKEN}"
#       }
#     }
#   }
# }
```

### Step 3: Restart Claude Code

```bash
# MCP servers only load on startup
# Restart Claude Code to load @notionhq/notion-mcp-server
```

### Step 4: Verify and Resume

```bash
# Your existing database IDs work with MCP!
# No need to recreate databases

# Verify connection
/AgileFlow:notion DRY_RUN=true

# Resume syncing
/AgileFlow:notion
```

---

## TROUBLESHOOTING

### MCP Server Not Configured

**Error**: "notion MCP server not found" or "mcp__notion__* tools not available"

**Fix**:
```bash
# Run setup
/AgileFlow:setup-system

# Or manually create .mcp.json in project root:
cat > .mcp.json <<'EOF'
{
  "mcpServers": {
    "notion": {
      "command": "npx",
      "args": ["-y", "@notionhq/notion-mcp-server"],
      "env": {
        "NOTION_TOKEN": "${NOTION_TOKEN}"
      }
    }
  }
}
EOF

# CRITICAL: Restart Claude Code after creating .mcp.json
```

### Token Not Found

**Error**: "NOTION_TOKEN not set" or "Unauthorized"

**Fix**:
```bash
# Add token to .env in project root
echo "NOTION_TOKEN=secret_your_token_here" >> .env

# Verify it's there
grep NOTION_TOKEN .env

# Restart Claude Code
```

### Wrong MCP Package

**Error**: "mcp-remote not found" or connection errors

**Fix**:
```bash
# Check .mcp.json uses correct package
cat .mcp.json

# Should say "@notionhq/notion-mcp-server"
# NOT "mcp-remote"

# If wrong, update .mcp.json and restart Claude Code
```

### Project-Level Config Not Working

**Error**: MCP config not loading

**Fix**:
```bash
# CRITICAL: .mcp.json must be in PROJECT ROOT
pwd  # Should show /path/to/your/project
ls -la .mcp.json  # Should exist in current directory

# NOT in ~/.claude-code/ or ~/.config/claude-code/
# Those locations won't work for project-specific MCP servers
```

### Databases Not Found

**Error**: "Database IDs missing in sync map"

**Fix**:
```bash
/AgileFlow:notion MODE=setup
```

### Rate Limiting

**Error**: "Rate limit exceeded"

**Fix**: MCP handles this automatically with exponential backoff. Wait a few seconds and retry.

### Sync Conflicts

**Error**: "Conflict detected: both local and Notion changed"

**Fix**:
```bash
# Review conflict details
/AgileFlow:notion MODE=sync DRY_RUN=true

# Choose resolution strategy
/AgileFlow:notion MODE=sync  # Manual prompts
# or
/AgileFlow:notion MODE=export FORCE=true  # Local wins
# or
/AgileFlow:notion MODE=import FORCE=true  # Notion wins
```

### Database Not Shared With Integration

**Error**: "object not found" or "insufficient permissions"

**Fix**:
```bash
# In Notion, for each database:
# 1. Click "..." (three dots) in top right
# 2. Click "Add connections"
# 3. Select your integration name
# 4. Try sync again
```

---

## FUTURE ENHANCEMENTS

- [ ] Auto-sync on file changes (watch mode)
- [ ] Conflict resolution UI in Claude Code
- [ ] Comment syncing (mcp__notion__create_comment)
- [ ] Attachment support
- [ ] Webhook integration (Notion → AgileFlow)
- [ ] Multi-workspace support
- [ ] Custom property mappings
- [ ] Rollback support (restore from log)

---

## RELATED COMMANDS

- `/AgileFlow:setup-system` - Initial AgileFlow + MCP configuration
- `/AgileFlow:github-sync` - Sync with GitHub Issues (uses GitHub CLI)
- `/AgileFlow:story-new` - Create new story (auto-exports if Notion enabled)
- `/AgileFlow:epic-new` - Create new epic (auto-exports if Notion enabled)
- `/AgileFlow:adr-new` - Create new ADR (auto-exports if Notion enabled)
- `/AgileFlow:board` - Visualize status (can pull from Notion)

## RELATED AGENTS

- `agileflow-notion-exporter` - Parallel export agent (spawned by this command)
  - Haiku model for fast summarization
  - Processes one epic/story/ADR at a time
  - Generates detailed summaries with full content
  - Uses MCP tools to export to Notion
  - Returns JSON with page ID and status

---

## REFERENCES

- [@notionhq/notion-mcp-server](https://www.npmjs.com/package/@notionhq/notion-mcp-server) - Notion MCP Package
- [MCP Documentation](https://modelcontextprotocol.io/docs/getting-started/intro) - Model Context Protocol
- [MCP Supported Tools](https://developers.notion.com/docs/mcp-supported-tools) - Notion MCP Tools List
- [Claude Code MCP Guide](https://docs.claude.com/en/docs/claude-code/mcp) - MCP in Claude Code
- [Notion API Reference](https://developers.notion.com/reference/intro) - Notion API Docs
- [Create Notion Integration](https://www.notion.so/my-integrations) - Get Your Token

---

## KEY LEARNINGS (v2.3.0 Correction)

**What We Got Wrong Initially**:
- ❌ Claimed OAuth authentication via /mcp command
- ❌ Said "no manual token management"
- ❌ Used wrong package (mcp-remote instead of @notionhq/notion-mcp-server)
- ❌ Suggested committing .mcp.json to git (should be gitignored)

**What's Actually Correct**:
- ✅ Still uses NOTION_TOKEN in .env (token-based)
- ✅ Uses @notionhq/notion-mcp-server package
- ✅ Project-level .mcp.json in repo root (not user-level)
- ✅ .mcp.json gitignored, .mcp.json.example committed as template
- ✅ MCP provides standardized tool interface, NOT authentication
- ✅ Each team member needs their own token

**Credit**: Thank you to the user who discovered the correct approach through testing!

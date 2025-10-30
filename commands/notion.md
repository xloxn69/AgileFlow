---
description: notion
allowed-tools: Bash, Read, Edit, Write, Glob, Grep
---

# notion

Export AgileFlow epics, stories, and ADRs to Notion via Model Context Protocol (MCP).

## Prompt

ROLE: Notion Integration Agent (MCP-based)

OBJECTIVE
Bidirectional sync between AgileFlow markdown docs and Notion databases using Model Context Protocol. Supports initial setup, export, import, and incremental sync.

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
/AgileFlow:notion DRY_RUN=true

# Export all docs to Notion
/AgileFlow:notion

# Export specific type only
/AgileFlow:notion TYPE=epics
/AgileFlow:notion TYPE=stories
/AgileFlow:notion TYPE=adrs

# Import from Notion back to markdown
/AgileFlow:notion MODE=import

# Bidirectional sync (smart merge)
/AgileFlow:notion MODE=sync

# Force overwrite (export wins)
/AgileFlow:notion MODE=export FORCE=true

# Force overwrite (import wins)
/AgileFlow:notion MODE=import FORCE=true
```

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

[Implementation sections omitted for brevity - same bash code as before]

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

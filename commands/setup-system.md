# setup-system

Scaffold the universal agile/docs-as-code system for this repository.

## Prompt

ROLE: System Scaffolder (Agile + Docs-as-Code)

OBJECTIVE
Create/update a universal agile/docs system that works in any repo. Be idempotent. Diff-first. Ask YES/NO before changing files or executing commands.

DETECTION PHASE (run first, before asking anything)
Detect what's already configured and report status:

```bash
# Check core structure
[ -d docs/00-meta ] && echo "✅ Core docs structure exists" || echo "❌ Core docs structure missing"
[ -f docs/09-agents/status.json ] && echo "✅ Agent status tracking exists" || echo "❌ Agent status tracking missing"

# Check GitHub Issues integration
[ -f docs/08-project/github-sync-map.json ] && echo "✅ GitHub Issues sync configured" || echo "❌ GitHub Issues sync not configured"

# Check MCP integrations (Notion, Supabase, etc.)
if [ -f .mcp.json ]; then
  echo "✅ MCP config exists (.mcp.json)"

  # Check Notion
  if grep -q '"notion"' .mcp.json 2>/dev/null; then
    echo "  ✅ Notion MCP configured in .mcp.json"
    # Check if token is still placeholder
    if grep -q "ntn_YOUR_NOTION_TOKEN_HERE" .mcp.json 2>/dev/null; then
      echo "    ⚠️  Token is still placeholder - edit .mcp.json with your real token"
    else
      echo "    ✅ Token configured in .mcp.json"
    fi
    [ -f docs/08-project/notion-sync-map.json ] && echo "    ✅ Notion databases configured" || echo "    ⚠️  Notion databases not set up - run /notion-export MODE=setup"
  else
    echo "  ⚠️  Notion not configured in .mcp.json"
  fi

  # Check GitHub
  if grep -q '"github"' .mcp.json 2>/dev/null; then
    echo "  ✅ GitHub MCP configured in .mcp.json"
    # Check if token is still placeholder
    if grep -q "ghp_YOUR_GITHUB_TOKEN_HERE" .mcp.json 2>/dev/null; then
      echo "    ⚠️  Token is still placeholder - edit .mcp.json with your real token"
    else
      echo "    ✅ Token configured in .mcp.json"
    fi
  else
    echo "  ⚠️  GitHub not configured in .mcp.json"
  fi

  # Check Supabase
  if grep -q '"supabase"' .mcp.json 2>/dev/null; then
    echo "  ✅ Supabase MCP configured"
    grep -q "SUPABASE_URL" .env.example 2>/dev/null && echo "    ✅ Supabase vars in .env.example" || echo "    ⚠️  Supabase vars not in .env.example"
  fi
elif [ -f .mcp.json.example ]; then
  echo "⚠️  MCP template exists (.mcp.json.example) but not copied to .mcp.json"
  echo "   Run: cp .mcp.json.example .mcp.json"
else
  echo "❌ MCP not configured (no .mcp.json or .mcp.json.example)"
fi

# Check CI
[ -f .github/workflows/ci.yml ] && echo "✅ CI workflow exists" || echo "❌ CI workflow missing"

# Check runtime detection
[ -f docs/00-meta/runtime.json ] && echo "✅ Runtime detected" || echo "❌ Runtime not detected"
```

**Display Status Summary First**:
```
📊 Current AgileFlow Setup Status:
==================================
Core System: ✅ Configured / ❌ Not configured
GitHub Issues Sync: ✅ Configured / ❌ Not configured / ⚠️ Partially configured
MCP Integrations:
  - Notion: ✅ Configured / ❌ Not configured / ⚠️ Partially configured
  - GitHub: ✅ Configured / ❌ Not configured / ⚠️ Partially configured
  - Supabase: ✅ Configured / ❌ Not configured / ⚠️ Partially configured
CI Workflow: ✅ Configured / ❌ Not configured
```

INPUTS (ask only about missing/incomplete features)
Based on detection results above, ask ONLY about features that aren't fully configured:

- IF core system missing: "Initialize core AgileFlow structure? yes/no"
- IF MCP not configured: "Enable MCP integrations? (Model Context Protocol for GitHub, Notion, etc.) yes/no"
  - IF yes: Ask which servers to enable: "Enable GitHub? yes/no", "Enable Notion? yes/no", "Enable Supabase? yes/no"
- IF MCP partially configured:
  - IF .mcp.json has servers with placeholder tokens: Report what's missing (e.g., "GitHub token is still placeholder")
  - Print next steps: "To complete setup: 1) Edit .mcp.json with your real tokens, 2) Restart Claude Code"
- IF GitHub sync missing: "Create GitHub sync mapping? (requires GitHub MCP) yes/no"
- IF CI missing: "Create minimal CI workflow? yes/no"

Skip asking about features that are already fully configured (just report them as ✅).

CREATE DIRECTORIES (if missing)
docs/{00-meta/{templates,guides,scripts},01-brainstorming/{ideas,sketches},02-practices/prompts/agents,03-decisions,04-architecture,05-epics,06-stories,07-testing/{acceptance,test-cases},08-project,09-agents/bus,10-research}
.github/workflows

CREATE/SEED FILES (only if missing; never overwrite non-empty content)
- docs/README.md — map of all folders
- docs/chatgpt.md — one-page brief with managed sections (placeholders)
- docs/00-meta/{glossary.md,conventions.md}
- docs/00-meta/templates/{README-template.md,story-template.md,epic-template.md,adr-template.md,agent-profile-template.md,comms-note-template.md,research-template.md}
- docs/00-meta/guides/worktrees.md — copy from templates/worktrees-guide.md (comprehensive git worktrees guide for context preservation)
- docs/00-meta/scripts/worktree-create.sh — copy from templates/worktree-create.sh (helper script, make executable with chmod +x)
- docs/02-practices/{README.md,testing.md,git-branching.md,releasing.md,security.md,ci.md}
- docs/02-practices/prompts/agents/{agent-ui.md,agent-api.md,agent-ci.md}
- docs/03-decisions/README.md
- docs/04-architecture/README.md
- docs/05-epics/README.md
- docs/06-stories/README.md
- docs/07-testing/README.md
- docs/08-project/{README.md,roadmap.md,backlog.md,milestones.md,risks.md}
- docs/09-agents/{README.md,status.json}  // seed with {"updated":"","stories":{}}
- docs/09-agents/bus/log.jsonl            // empty
- docs/10-research/README.md              // index table: Date | Topic | Path | Summary
- .github/workflows/ci.yml                // minimal, language-agnostic CI (lint/type/test placeholders)
- .gitignore                              // generic: .env*, .DS_Store, .idea/, .vscode/, node_modules/, dist/, build/, coverage/
- .env.example                            // placeholder with GH_TOKEN= and NOTION_TOKEN= with note: never commit .env (contains secrets)
- docs/08-project/github-sync-map.json    // if GitHub sync enabled: {"last_sync":null,"mappings":{},"config":{}}
- docs/08-project/notion-sync-map.json    // if Notion enabled: {"last_sync":null,"epics":{},"stories":{},"adrs":{}}
- docs/02-practices/prompts/commands-catalog.md // paste-ready list of all slash commands & prompts (print content at the end)

OS/RUNTIME DETECTION (safe, best-effort)
- Detect OS/arch and common runtimes using commands:
  - Unix-like: `uname -s`, `uname -m`, `sh -c 'git --version || true'`
  - Windows: `cmd /c ver` (or similar, best-effort)
- Save to docs/00-meta/runtime.json: { os, arch, git_version, detected_at }

GITHUB MCP INTEGRATION SETUP (if enabled)
**IMPORTANT**: GitHub integration uses Model Context Protocol (MCP) for tool access and requires a GitHub Personal Access Token. MCP provides a standardized interface to GitHub's API.

**Prerequisites**:
1. Create a GitHub Personal Access Token at https://github.com/settings/tokens
2. Get your token (starts with `ghp_`)
3. Token permissions needed: `repo` (full control), `read:org` (if using organization repos)

**Step 1: Add GitHub to .mcp.json.example** (if not already present):
```json
{
  "mcpServers": {
    "github": {
      "command": "npx",
      "args": ["-y", "@modelcontextprotocol/server-github"],
      "env": {
        "GITHUB_PERSONAL_ACCESS_TOKEN": "ghp_YOUR_GITHUB_TOKEN_HERE"
      }
    }
  }
}
```

**CRITICAL - Token Hardcoding Required**:
- ⚠️ Environment variable substitution does NOT work in .mcp.json
- Tokens must be hardcoded directly in .mcp.json file
- .mcp.json MUST be gitignored to prevent token leaks
- .mcp.json.example is a template with placeholder text (committed to git)

**Step 2: Create GitHub Sync Mapping**:
Create `docs/08-project/github-sync-map.json`:
```json
{
  "last_sync": null,
  "mappings": {},
  "config": {
    "repository": "owner/repo"
  }
}
```

**Step 3: Copy Template and Add Real Token**:
```bash
# Each developer does this locally (not committed)
cp .mcp.json.example .mcp.json

# Edit .mcp.json and replace "ghp_YOUR_GITHUB_TOKEN_HERE" with your actual token
# GitHub PATs start with "ghp_"
# NEVER commit .mcp.json - it contains your real token!
```

**Step 4: Restart Claude Code**:
```bash
# MCP servers load on startup
# After restart, GitHub tools available as mcp__github__*
```

**Step 5: Run Initial Sync**:
```bash
# Preview what will happen
/AgileFlow:github-sync DRY_RUN=true

# Perform sync
/AgileFlow:github-sync
```

**Print Next Steps**:
```
✅ GitHub MCP template created (.mcp.json.example)
✅ .gitignore updated (.mcp.json excluded)
✅ GitHub sync mapping created
⚠️  You still need to configure YOUR GitHub token

Next steps for you:
1. Create GitHub PAT: https://github.com/settings/tokens (permissions: repo, read:org)
2. Copy template: cp .mcp.json.example .mcp.json
3. Edit .mcp.json and replace placeholder with your real token
4. Verify .mcp.json is in .gitignore (NEVER commit it!)
5. Restart Claude Code (to load MCP server)
6. Preview sync: /github-sync DRY_RUN=true
7. Perform sync: /github-sync

Next steps for team members:
1. Pull latest code (includes .mcp.json.example)
2. Create their own GitHub PAT
3. Copy template: cp .mcp.json.example .mcp.json
4. Edit .mcp.json with their real token
5. Verify .mcp.json is gitignored
6. Restart Claude Code
7. Start syncing!
```

NOTION INTEGRATION SETUP VIA MCP (if enabled)
**IMPORTANT**: Notion integration uses Model Context Protocol (MCP) for tool access and requires a Notion API token. MCP provides a standardized interface to Notion's API.

**Prerequisites**:
1. Create a Notion integration at https://www.notion.so/my-integrations
2. Get your Integration Token (starts with `ntn_`)
3. Share your Notion databases with the integration

**Step 1: Create .mcp.json.example** (template for team, committed to git)
```json
{
  "mcpServers": {
    "notion": {
      "command": "npx",
      "args": ["-y", "@notionhq/notion-mcp-server"],
      "env": {
        "NOTION_TOKEN": "ntn_YOUR_NOTION_TOKEN_HERE"
      }
    }
  }
}
```

**CRITICAL - Token Hardcoding Required**:
- ⚠️ Environment variable substitution (${NOTION_TOKEN}) does NOT work in .mcp.json
- Tokens must be hardcoded directly in .mcp.json file
- .mcp.json MUST be gitignored to prevent token leaks
- .mcp.json.example is a template with placeholder text (committed to git)

**Step 2: Create/Update .gitignore**
```bash
# Add MCP config to gitignore
echo ".mcp.json" >> .gitignore
```

**Step 3: Copy Template and Add Real Token**
```bash
# Each developer does this locally (not committed)
cp .mcp.json.example .mcp.json

# Edit .mcp.json and replace "ntn_YOUR_NOTION_TOKEN_HERE" with your actual token
# Notion tokens start with "ntn_"
# NEVER commit .mcp.json - it contains your real token!
```

**Step 4: Restart Claude Code**
```bash
# MCP servers load on startup
# After restart, Notion tools available as mcp__notion__*
```

**Step 5: Create AgileFlow Databases**
Run `/notion-export MODE=setup` which will:
- Use MCP tools to create 3 databases (Epics, Stories, ADRs)
- Store database IDs in `docs/08-project/notion-sync-map.json`

**Step 6: Verify Setup**
```bash
# Check if MCP tools loaded
# Look for mcp__notion__* tools in Claude Code

# Test by running
/AgileFlow:notion-export DRY_RUN=true
```

**Advantages of MCP Approach**:
- ✅ Standardized tool interface across services
- ✅ Native Claude Code integration
- ✅ Better error handling than raw API calls
- ✅ Automatic rate limiting
- ✅ Project-scoped configuration

**For Team Setup**:
1. One person creates integration and .mcp.json.example
2. Commit .mcp.json.example to git (with placeholder token)
3. Ensure .mcp.json is in .gitignore
4. Team members:
   - Pull latest code
   - Create their own Notion integration
   - Copy .mcp.json.example to .mcp.json
   - Edit .mcp.json and hardcode their real token
   - Restart Claude Code
   - Share databases with their integration

**Important Security Notes**:
- Each team member needs their own Notion token (no token sharing)
- Tokens are never committed to git (.mcp.json is gitignored)
- Tokens must be hardcoded in .mcp.json (env var substitution doesn't work)
- Always verify .mcp.json is in .gitignore before committing
- Project-level .mcp.json takes precedence over user-level config

**Print Next Steps**:
```
✅ Notion MCP template created (.mcp.json.example)
✅ .gitignore updated (.mcp.json excluded)
⚠️  You still need to configure YOUR Notion token

Next steps for you:
1. Create Notion integration: https://www.notion.so/my-integrations
2. Copy template: cp .mcp.json.example .mcp.json
3. Edit .mcp.json and replace placeholder with your real token
4. Verify .mcp.json is in .gitignore (NEVER commit it!)
5. Restart Claude Code (to load MCP server)
6. Create databases: /notion-export MODE=setup
7. Preview sync: /notion-export DRY_RUN=true
8. Perform initial sync: /notion-export

Next steps for team members:
1. Pull latest code (includes .mcp.json.example)
2. Create their own Notion integration
3. Copy template: cp .mcp.json.example .mcp.json
4. Edit .mcp.json with their real token
5. Verify .mcp.json is gitignored
6. Restart Claude Code
7. Share databases with their integration
8. Start syncing!
```

COMMAND EXECUTION
- Allowed after explicit YES with full preview. Good examples: `ls`, `tree`, `cat`, `grep`, formatters, running tests, creating files.
- Disallowed by default: destructive ops (`rm -rf`, force pushes) unless separately confirmed.

RULES
- Idempotent; update only missing files or managed sections.
- Validate JSON; no trailing commas.
- For every planned change, show a preview tree/diff and ask: Proceed? (YES/NO).
- After all writes/commands, print DONE + list of created/updated paths + executed commands with exit codes.

OUTPUT
- Initial detection summary (what was found)
- Preview tree and diffs (only for NEW files)
- runtime.json preview (if being created)
- If chosen: CI workflow preview and branch-protection commands
- If GitHub sync enabled: List of labels created and next steps
- If Notion enabled: Integration setup summary and next steps
- A rendered "commands catalog" (all prompts) to paste into your tool's custom commands UI
- Final status summary showing what was:
  - ✅ Already configured (skipped)
  - 🆕 Newly configured (created in this run)
  - ⚠️ Partially configured (needs user action)

  Example:
  ```
  📊 Final AgileFlow Setup Status:
  ==================================
  Core System: ✅ Already configured (skipped)
  GitHub Issues Sync: 🆕 Newly configured
    - Created docs/08-project/github-sync-map.json
    - Created 12 labels in repository
    - Next: Run /github-sync DRY_RUN=true
  MCP Integrations:
    Notion: ⚠️ Partially configured
      - ✅ .mcp.json has Notion server configured
      - ⚠️ Token is still placeholder - edit .mcp.json with your real token
      - ⚠️ Restart Claude Code after updating token
      - Next: /notion-export MODE=setup
    Supabase: ✅ Fully configured
      - ✅ .mcp.json has Supabase server configured
      - ✅ Token configured
      - Ready to use mcp__supabase__* tools
  CI Workflow: ✅ Already configured (skipped)

  Next steps:
  - Create your first epic: /epic-new
  - Create your first story: /story-new
  - View your board: /board
  - Sync to GitHub: /github-sync (newly enabled)
  - Complete Notion setup:
    1. Create integration: https://www.notion.so/my-integrations
    2. Edit .mcp.json: Replace placeholder with your real token
    3. Verify .mcp.json is in .gitignore (NEVER commit it!)
    4. Restart Claude Code
    5. Run: /notion-export MODE=setup
  ```

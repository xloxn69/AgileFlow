# setup-system

Scaffold the universal agile/docs-as-code system for this repository.

## Prompt

ROLE: System Scaffolder (Agile + Docs-as-Code)

OBJECTIVE
Create/update a universal agile/docs system that works in any repo. Be idempotent. Diff-first. Ask YES/NO before changing files or executing commands.

INPUTS (ask the user up front)
- Provide a GitHub token now? (optional; masked) TOKEN=<value or empty>
- Configure minimal CI and branch protections via GitHub CLI if available? yes/no
- Enable GitHub Issues sync? (creates sync mapping, sets up labels) yes/no
- Enable Notion integration via MCP? (uses Model Context Protocol) yes/no
  - If yes: Configure Notion MCP server for the project? yes/no

CREATE DIRECTORIES (if missing)
docs/{00-meta/templates,01-brainstorming/{ideas,sketches},02-practices/prompts/agents,03-decisions,04-architecture,05-epics,06-stories,07-testing/{acceptance,test-cases},08-project,09-agents/bus,10-research}
.github/workflows

CREATE/SEED FILES (only if missing; never overwrite non-empty content)
- docs/README.md — map of all folders
- docs/chatgpt.md — one-page brief with managed sections (placeholders)
- docs/00-meta/{glossary.md,conventions.md}
- docs/00-meta/templates/{README-template.md,story-template.md,epic-template.md,adr-template.md,agent-profile-template.md,comms-note-template.md,research-template.md}
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
- .env.example                            // placeholder with GH_TOKEN= and note not to commit secrets (Notion uses MCP OAuth, not .env)
- docs/08-project/github-sync-map.json    // if GitHub sync enabled: {"last_sync":null,"mappings":{},"config":{}}
- docs/08-project/notion-sync-map.json    // if Notion enabled: {"last_sync":null,"epics":{},"stories":{},"adrs":{}}
- docs/02-practices/prompts/commands-catalog.md // paste-ready list of all slash commands & prompts (print content at the end)

OS/RUNTIME DETECTION (safe, best-effort)
- Detect OS/arch and common runtimes using commands:
  - Unix-like: `uname -s`, `uname -m`, `sh -c 'git --version || true'`
  - Windows: `cmd /c ver` (or similar, best-effort)
- Save to docs/00-meta/runtime.json: { os, arch, git_version, detected_at }

GITHUB TOKEN & CI INTEGRATION (optional)
- Never write TOKEN to the repo. If provided:
  - Offer to set it as a repo secret via GitHub CLI (preview commands; require YES):
    - `gh auth status || gh auth login`
    - `gh secret set GH_TOKEN -b"$TOKEN"`
  - If CLI unavailable, print manual steps for Settings → Secrets and variables → Actions.
- Offer to enable minimal branch protection (if confirmed and `gh` works):
  - Preview command (require YES):
    - `gh api -X PUT repos/{owner}/{repo}/branches/main/protection --input - <<<'{"required_status_checks":{"strict":true,"contexts":["CI"]},"enforce_admins":true,"required_pull_request_reviews":{"required_approving_review_count":1}}'`
  - Otherwise print manual instructions.

GITHUB ISSUES SYNC SETUP (if enabled)
- Create docs/08-project/github-sync-map.json with initial structure
- Detect repository from git remote (or ask user for owner/repo)
- Add GITHUB_REPO to .env (never commit)
- Create standard AgileFlow labels in repository:
  - `agileflow:story`, `epic:*`, `owner:*`, `Status: *`
  - Preview command (require YES):
    - `gh label create "agileflow:story" --description "Story tracked in AgileFlow" --color "0366d6"`
    - (repeat for all standard labels)
- Print next steps:
  - "Run /github-sync DRY_RUN=true to preview first sync"
  - "Run /github-sync to perform initial export"

NOTION INTEGRATION SETUP VIA MCP (if enabled)
**IMPORTANT**: Notion integration uses Model Context Protocol (MCP) for tool access, but still requires a Notion API token. MCP provides a standardized interface to Notion's API.

**Prerequisites**:
1. Create a Notion integration at https://www.notion.so/my-integrations
2. Get your Integration Token (starts with `secret_`)
3. Share your Notion databases with the integration

**Step 1: Add NOTION_TOKEN to .env** (gitignored, never commit)
```bash
# Add to .env file
echo "NOTION_TOKEN=secret_your_token_here" >> .env

# Verify .env is in .gitignore
grep -q "^\.env$" .gitignore || echo ".env" >> .gitignore
```

**Step 2: Create .mcp.json.example** (template for team, committed to git)
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

**IMPORTANT - Project-Level Configuration**:
- .mcp.json must be in the **project root** (not ~/.claude-code/ or ~/.config/)
- The ${NOTION_TOKEN} reference pulls from your .env file
- .mcp.json should be gitignored to avoid committing tokens
- Commit .mcp.json.example as a template for team members

**Step 3: Create/Update .gitignore**
```bash
# Add MCP config to gitignore
echo ".mcp.json" >> .gitignore
echo ".env" >> .gitignore
```

**Step 4: Copy Template to Active Config**
```bash
# Each developer does this locally (not committed)
cp .mcp.json.example .mcp.json

# Add their own NOTION_TOKEN to .env
echo "NOTION_TOKEN=secret_their_token_here" >> .env
```

**Step 5: Restart Claude Code**
```bash
# MCP servers load on startup
# After restart, Notion tools available as mcp__notion__*
```

**Step 6: Create AgileFlow Databases**
Run `/notion-export MODE=setup` which will:
- Use MCP tools to create 3 databases (Epics, Stories, ADRs)
- Store database IDs in `docs/08-project/notion-sync-map.json`
- Database creation uses NOTION_TOKEN from .env via MCP

**Step 7: Verify Setup**
```bash
# Check if MCP tools loaded
# Look for mcp__notion__* tools in Claude Code

# Test by running
/notion-export DRY_RUN=true
```

**Advantages of MCP Approach**:
- ✅ Standardized tool interface across services
- ✅ Native Claude Code integration
- ✅ Better error handling than raw API calls
- ✅ Automatic rate limiting
- ✅ Project-scoped configuration

**For Team Setup**:
1. One person creates integration and .mcp.json.example
2. Commit .mcp.json.example to git (with ${NOTION_TOKEN} placeholder)
3. Add .mcp.json and .env to .gitignore
4. Team members:
   - Pull latest code
   - Create their own Notion integration
   - Copy .mcp.json.example to .mcp.json
   - Add their NOTION_TOKEN to .env
   - Restart Claude Code
   - Share databases with their integration

**Important Notes**:
- Each team member needs their own Notion token (no token sharing)
- Tokens are never committed to git
- .mcp.json uses env var substitution: ${NOTION_TOKEN}
- Project-level .mcp.json takes precedence over user-level config

**Print Next Steps**:
```
✅ Notion MCP template created (.mcp.json.example)
✅ .gitignore updated (.mcp.json and .env excluded)
⚠️  You still need to configure YOUR Notion token

Next steps for you:
1. Create Notion integration: https://www.notion.so/my-integrations
2. Add token to .env: NOTION_TOKEN=secret_xxx
3. Copy template: cp .mcp.json.example .mcp.json
4. Restart Claude Code (to load MCP server)
5. Create databases: /notion-export MODE=setup
6. Preview sync: /notion-export DRY_RUN=true
7. Perform initial sync: /notion-export

Next steps for team members:
1. Pull latest code (includes .mcp.json.example)
2. Create their own Notion integration
3. Copy template: cp .mcp.json.example .mcp.json
4. Add their token to .env
5. Restart Claude Code
6. Share databases with their integration
7. Start syncing!
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
- Preview tree and diffs
- runtime.json preview
- If chosen: CI workflow preview and branch-protection commands
- If GitHub sync enabled: List of labels created and next steps
- If Notion enabled: Integration setup summary and next steps
- A rendered "commands catalog" (all prompts) to paste into your tool's custom commands UI
- Summary of integration status:
  ```
  ✅ AgileFlow system initialized
  ✅ GitHub token configured (optional)
  ✅ GitHub Issues sync ready (optional)
  ✅ Notion integration configured (optional)

  Next steps:
  - Create your first epic: /epic-new
  - Create your first story: /story-new
  - View your board: /board
  - Sync to GitHub: /github-sync (if enabled)
  - Sync to Notion: /notion-export (if enabled)
  ```

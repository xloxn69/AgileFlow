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
    [ -f docs/08-project/notion-sync-map.json ] && echo "    ✅ Notion databases configured" || echo "    ⚠️  Notion databases not set up - run /AgileFlow:notion-export MODE=setup"
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

- **CRITICAL - Git Attribution Preference** (ALWAYS ask on first setup):
  - "Disable Claude Code attribution in git commits? (Removes '🤖 Generated with Claude Code' and 'Co-Authored-By: Claude' from commit messages) yes/no"
  - **Why ask**: Many users prefer not to disclose AI usage in their git history due to:
    - Professional reputation concerns
    - Company policies against AI disclosure
    - Client perception issues
    - Personal preference for ownership
  - **If yes**: Add to CLAUDE.md a CRITICAL section instructing Claude to NEVER add attribution
  - **If no**: Claude will continue adding attribution as normal

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

**IMPORTANT - docs/02-practices Purpose**:
- docs/02-practices is for **USER'S CODEBASE practices** (NOT AgileFlow system practices)
- Examples: Styling conventions, typography standards, CSS architecture, component patterns, API design patterns
- AgileFlow system documentation goes in docs/00-meta/ (guides, templates, scripts)
- This distinction ensures clarity between "how we build the product" vs "how we use AgileFlow"

CREATE/SEED FILES (only if missing; never overwrite non-empty content)
- docs/README.md — map of all folders
- docs/chatgpt.md — one-page brief with managed sections (placeholders)
- docs/00-meta/{glossary.md,conventions.md}
- docs/00-meta/agileflow-metadata.json — copy from templates/agileflow-metadata.json, update timestamp and version
- docs/00-meta/templates/{README-template.md,story-template.md,epic-template.md,adr-template.md,agent-profile-template.md,comms-note-template.md,research-template.md}
- docs/00-meta/guides/worktrees.md — copy from templates/worktrees-guide.md (comprehensive git worktrees guide for context preservation)
- docs/00-meta/guides/MCP-WRAPPER-SCRIPTS.md — copy from templates/MCP-WRAPPER-SCRIPTS.md (MCP security best practices and wrapper scripts guide)
- docs/00-meta/scripts/worktree-create.sh — copy from templates/worktree-create.sh (helper script, make executable with chmod +x)
- docs/00-meta/scripts/mcp-wrapper-postgres.sh — copy from templates/mcp-wrapper-postgres.sh (example wrapper script for MCP servers without ${VAR} support, make executable with chmod +x)
- docs/02-practices/{README.md,testing.md,git-branching.md,releasing.md,security.md,ci.md} — **USER CODEBASE practices** (styling, typography, component patterns, API conventions, etc.) NOT AgileFlow practices
- docs/02-practices/prompts/agents/{agent-ui.md,agent-api.md,agent-ci.md} — Project-specific agent customization prompts
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
- .gitignore                              // CRITICAL: MUST include .mcp.json AND .env (for MCP security), plus generic: .env*, .DS_Store, .idea/, .vscode/, node_modules/, dist/, build/, coverage/
- .env.example                            // copy from AgileFlow templates/.env.example with all MCP tokens documented
- .mcp.json.example                       // copy from AgileFlow templates/.mcp.json.example with ${VAR} syntax
- docs/08-project/github-sync-map.json    // if GitHub sync enabled: {"last_sync":null,"mappings":{},"config":{}}
- docs/08-project/notion-sync-map.json    // if Notion enabled: {"last_sync":null,"epics":{},"stories":{},"adrs":{}}
- docs/02-practices/prompts/commands-catalog.md // paste-ready list of all slash commands & prompts (print content at the end)
- **CLAUDE.md** — AI assistant configuration (create if missing, update if exists)

CLAUDE.MD GENERATION/UPDATE (CRITICAL)
**IMPORTANT**: CLAUDE.md is the AI assistant's primary configuration file. It MUST be created or updated based on user preferences.

**If CLAUDE.md does NOT exist**:
Create CLAUDE.md with:
1. Project placeholder sections (Build/Test Commands, Architecture, etc.)
2. **Git Attribution preference** based on user's answer above

**If CLAUDE.md already exists**:
- Check if it contains git attribution rules
- If user chose to disable attribution AND CLAUDE.md doesn't have the rule → Add it
- If user chose to keep attribution AND CLAUDE.md has the disable rule → Remove it

**Git Attribution Configuration**:

**If user answered YES to "Disable Claude Code attribution"**, add this section to CLAUDE.md:

```markdown
## ⚠️ CRITICAL: Git Commit Attribution Policy

**DO NOT ADD AI ATTRIBUTION TO GIT COMMITS**

This is a CRITICAL requirement for this project. When creating git commits:

❌ **NEVER** add these lines:
- `🤖 Generated with [Claude Code](https://claude.com/claude-code)`
- `Co-Authored-By: Claude <noreply@anthropic.com>`
- Any other AI attribution or disclosure

✅ **DO** create clean commit messages:
- Follow Conventional Commits format (feat:, fix:, docs:, etc.)
- Write clear, descriptive commit messages
- Focus on WHAT changed and WHY
- Attribute work to the human developer only

**Why this matters**:
- Professional reputation and career concerns
- Company/client policies may prohibit AI disclosure
- Personal preference for ownership of work
- Git history should reflect team contributions accurately

**This rule applies to**:
- ALL commits made via Claude Code
- Manual commits suggested by Claude
- Automated commits from AgileFlow commands
- Any git operation that creates commit messages

**Enforcement**: This is NON-NEGOTIABLE. If you add AI attribution to any commit, it violates this project's requirements.
```

**If user answered NO** (keep attribution), do NOT add the above section to CLAUDE.md. Claude will use default behavior (adding attribution).

**Print confirmation**:
```
Git Attribution: [Disabled / Enabled]
- Commits will [NOT / WILL] include Claude Code attribution
- CLAUDE.md [updated / not modified] with attribution policy
```

OS/RUNTIME DETECTION (safe, best-effort)
- Detect OS/arch and common runtimes using commands:
  - Unix-like: `uname -s`, `uname -m`, `sh -c 'git --version || true'`
  - Windows: `cmd /c ver` (or similar, best-effort)
- Save to docs/00-meta/runtime.json: { os, arch, git_version, detected_at }

GIT REPOSITORY SETUP (CRITICAL - required for all projects)
**IMPORTANT**: Every AgileFlow project should be a git repository with a configured remote. This enables version control, team collaboration, and backup.

**Detection**:
```bash
# Check if git is initialized
[ -d .git ] && echo "✅ Git initialized" || echo "❌ Git not initialized"

# Check if remote is configured
git remote -v 2>/dev/null | grep -q origin && echo "✅ Git remote configured" || echo "⚠️ Git remote not configured"
```

**Setup Steps**:

1. **If git not initialized**:
   - Ask user: "Initialize git repository? yes/no"
   - If yes: `git init`

2. **If remote not configured** (CRITICAL):
   - Ask user: "Git remote URL (e.g., git@github.com:user/repo.git or https://github.com/user/repo.git):"
   - Store in variable: `REPO_URL`
   - Configure remote: `git remote add origin "$REPO_URL"`
   - Verify: `git remote -v`
   - Update agileflow-metadata.json:
     ```json
     {
       "git": {
         "initialized": true,
         "remoteConfigured": true,
         "remoteUrl": "git@github.com:user/repo.git"
       }
     }
     ```

3. **Print git setup status**:
   ```
   ✅ Git repository initialized
   ✅ Git remote configured: git@github.com:user/repo.git

   Next steps:
   - Add files: git add .
   - Create first commit: git commit -m "Initial commit with AgileFlow setup"
   - Push to remote: git push -u origin main
   ```

**Why This Matters**:
- Version control for all AgileFlow docs (epics, stories, ADRs)
- Team collaboration via GitHub/GitLab
- Backup and disaster recovery
- Integration with GitHub Issues sync (/AgileFlow:github-sync)
- Enables proper .gitignore for secrets (.mcp.json, .env)

GITHUB MCP INTEGRATION SETUP (if enabled)
**IMPORTANT**: GitHub integration uses Model Context Protocol (MCP) for tool access and requires a GitHub Personal Access Token. MCP provides a standardized interface to GitHub's API.

**Prerequisites**:
1. Create a GitHub Personal Access Token at https://github.com/settings/tokens
2. Get your token (starts with `ghp_`)
3. Token permissions needed: `repo` (full control), `read:org` (if using organization repos)

**Step 1: Copy MCP templates to project root**:
Copy `.mcp.json.example` and `.env.example` from AgileFlow plugin templates to project root.

**Step 2: Verify .mcp.json uses environment variable substitution**:
```json
{
  "mcpServers": {
    "github": {
      "command": "npx",
      "args": ["-y", "@modelcontextprotocol/server-github"],
      "env": {
        "GITHUB_PERSONAL_ACCESS_TOKEN": "${GITHUB_PERSONAL_ACCESS_TOKEN}"
      }
    }
  }
}
```

**⚠️ CRITICAL SECURITY - Environment Variables (NOT Hardcoded Tokens)**:
- ✅ USE ${VAR} syntax in .mcp.json (reads from .env)
- ✅ Store actual tokens in .env (NOT .mcp.json)
- ✅ BOTH .mcp.json AND .env MUST be in .gitignore
- ✅ Commit .mcp.json.example and .env.example (with ${VAR} syntax and placeholders)
- ❌ NEVER hardcode tokens in .mcp.json
- ❌ NEVER commit .mcp.json or .env to git

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

**Step 3: Ensure .gitignore has BOTH .mcp.json AND .env** (CRITICAL):
```bash
# Check if already present
grep -E '^\\.mcp\\.json$' .gitignore || echo ".mcp.json" >> .gitignore
grep -E '^\\.env$' .gitignore || echo ".env" >> .gitignore

# Verify (should show both)
grep -E '\\.mcp\\.json|\\.env' .gitignore
```

**Step 4: Copy templates and add real tokens**:
```bash
# Copy templates (each developer does this locally - not committed)
cp .mcp.json.example .mcp.json
cp .env.example .env

# Edit .env and add your real GitHub token
# GITHUB_PERSONAL_ACCESS_TOKEN=ghp_your_actual_token_here
# GitHub PATs start with "ghp_"

# DO NOT edit .mcp.json - it uses ${VAR} to read from .env!
# NEVER commit .mcp.json or .env - they're in .gitignore!
```

**Step 5: Restart Claude Code**:
```bash
# MCP servers load on startup and read .env via ${VAR} substitution
# After restart, GitHub tools available as mcp__github__*
```

**Step 6: Run Initial Sync**:
```bash
# Preview what will happen
/AgileFlow:github-sync DRY_RUN=true

# Perform sync
/AgileFlow:github-sync
```

**Print Next Steps**:
```
✅ GitHub MCP template created (.mcp.json.example with ${VAR} syntax)
✅ .env template created (.env.example)
✅ .gitignore updated (.mcp.json AND .env excluded)
✅ GitHub sync mapping created
⚠️  You still need to configure YOUR GitHub token

Next steps for you:
1. Create GitHub PAT: https://github.com/settings/tokens (permissions: repo, read:org)
2. Copy templates:
   cp .mcp.json.example .mcp.json
   cp .env.example .env
3. Edit .env and add your real token (GITHUB_PERSONAL_ACCESS_TOKEN=ghp_...)
4. DO NOT edit .mcp.json (it uses ${VAR} to read from .env)
5. Verify BOTH .mcp.json AND .env are in .gitignore: grep -E '\\.mcp\\.json|\\.env' .gitignore
6. NEVER commit .mcp.json or .env (contain secrets!)
7. Restart Claude Code (to load MCP server)
8. Preview sync: /AgileFlow:github-sync DRY_RUN=true
9. Perform sync: /AgileFlow:github-sync

Next steps for team members:
1. Pull latest code (includes .mcp.json.example and .env.example)
2. Create their own GitHub PAT
3. Copy templates: cp .mcp.json.example .mcp.json && cp .env.example .env
4. Edit .env with their real token
5. Verify .gitignore has .mcp.json and .env
6. Restart Claude Code
7. Start syncing!
```

NOTION INTEGRATION SETUP VIA MCP (if enabled)
**IMPORTANT**: Notion integration uses Model Context Protocol (MCP) for tool access and requires a Notion API token. MCP provides a standardized interface to Notion's API.

**Prerequisites**:
1. Create a Notion integration at https://www.notion.so/my-integrations
2. Get your Integration Token (starts with `ntn_`)
3. Share your Notion databases with the integration

**Step 1: Verify .mcp.json.example uses environment variable substitution**:
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

**⚠️ CRITICAL SECURITY - Environment Variables (NOT Hardcoded Tokens)**:
- ✅ USE ${VAR} syntax in .mcp.json (reads from .env)
- ✅ Store actual tokens in .env (NOT .mcp.json)
- ✅ BOTH .mcp.json AND .env MUST be in .gitignore
- ✅ Commit .mcp.json.example and .env.example (with ${VAR} syntax and placeholders)
- ❌ NEVER hardcode tokens in .mcp.json
- ❌ NEVER commit .mcp.json or .env to git

**Step 2: Ensure .gitignore has BOTH .mcp.json AND .env** (CRITICAL):
```bash
# Check if already present
grep -E '^\\.mcp\\.json$' .gitignore || echo ".mcp.json" >> .gitignore
grep -E '^\\.env$' .gitignore || echo ".env" >> .gitignore

# Verify (should show both)
grep -E '\\.mcp\\.json|\\.env' .gitignore
```

**Step 3: Copy templates and add real tokens**:
```bash
# Copy templates (each developer does this locally - not committed)
cp .mcp.json.example .mcp.json
cp .env.example .env

# Edit .env and add your real Notion token
# NOTION_TOKEN=ntn_your_actual_token_here
# Notion tokens start with "ntn_"

# DO NOT edit .mcp.json - it uses ${VAR} to read from .env!
# NEVER commit .mcp.json or .env - they're in .gitignore!
```

**Step 4: Restart Claude Code**
```bash
# MCP servers load on startup
# After restart, Notion tools available as mcp__notion__*
```

**Step 5: Create AgileFlow Databases**
Run `/AgileFlow:notion-export MODE=setup` which will:
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
- Each team member needs their own tokens (NO SHARING)
- Tokens stored in .env (NOT .mcp.json)
- .mcp.json uses ${VAR} to read from .env
- BOTH .mcp.json AND .env MUST be gitignored
- Commit .mcp.json.example and .env.example (templates with ${VAR} and placeholders)
- Project-level .mcp.json takes precedence over user-level config

**Print Next Steps**:
```
✅ Notion MCP template created (.mcp.json.example with ${VAR} syntax)
✅ .env template created (.env.example)
✅ .gitignore updated (.mcp.json AND .env excluded)
⚠️  You still need to configure YOUR Notion token

Next steps for you:
1. Create Notion integration: https://www.notion.so/my-integrations
2. Copy templates:
   cp .mcp.json.example .mcp.json
   cp .env.example .env
3. Edit .env and add your real token (NOTION_TOKEN=ntn_...)
4. DO NOT edit .mcp.json (it uses ${VAR} to read from .env)
5. Verify BOTH .mcp.json AND .env are in .gitignore: grep -E '\\.mcp\\.json|\\.env' .gitignore
6. NEVER commit .mcp.json or .env (contain secrets!)
7. Restart Claude Code (to load MCP server)
8. Create databases: /AgileFlow:notion-export MODE=setup
9. Preview sync: /AgileFlow:notion-export DRY_RUN=true
10. Perform initial sync: /AgileFlow:notion-export

Next steps for team members:
1. Pull latest code (includes .mcp.json.example and .env.example)
2. Create their own Notion integration
3. Copy templates: cp .mcp.json.example .mcp.json && cp .env.example .env
4. Edit .env with their real token
5. Verify .gitignore has .mcp.json and .env
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
- **Git Attribution Policy** - Confirmation of user's preference (disabled/enabled)
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
  Core System: 🆕 Newly configured
    - Created docs/ directory structure
    - Initialized AgileFlow metadata
    - Git remote configured: git@github.com:user/repo.git

  Git Attribution: 🆕 Disabled
    - ✅ CLAUDE.md updated with NO ATTRIBUTION policy
    - ✅ Commits will NOT include Claude Code attribution
    - ✅ Clean git history (no AI disclosure)

  GitHub Issues Sync: 🆕 Newly configured
    - Created docs/08-project/github-sync-map.json
    - Created 12 labels in repository
    - Next: Run /AgileFlow:github-sync DRY_RUN=true

  MCP Integrations:
    Notion: ⚠️ Partially configured
      - ✅ .mcp.json has Notion server configured
      - ⚠️ Token is still placeholder - edit .mcp.json with your real token
      - ⚠️ Restart Claude Code after updating token
      - Next: /AgileFlow:notion-export MODE=setup
    Supabase: ✅ Fully configured
      - ✅ .mcp.json has Supabase server configured
      - ✅ Token configured
      - Ready to use mcp__supabase__* tools

  CI Workflow: ✅ Already configured (skipped)

  Next steps:
  - Create your first epic: /AgileFlow:epic-new
  - Create your first story: /AgileFlow:story-new
  - View your board: /AgileFlow:board
  - Sync to GitHub: /AgileFlow:github-sync (newly enabled)
  - Complete Notion setup:
    1. Create integration: https://www.notion.so/my-integrations
    2. Edit .mcp.json: Replace placeholder with your real token
    3. Verify .mcp.json is in .gitignore (NEVER commit it!)
    4. Restart Claude Code
    5. Run: /AgileFlow:notion-export MODE=setup
  ```

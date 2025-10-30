---
description: setup-system
allowed-tools: Bash, Read, Edit, Write, Glob, Grep
---

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
    echo "  ✅ Notion MCP configured"
    [ -f docs/08-project/notion-sync-map.json ] && echo "    ✅ Notion databases configured" || echo "    ⚠️  Notion databases not set up - run /AgileFlow:notion MODE=setup"
  else
    echo "  ⚠️  Notion not configured"
  fi

  # Check GitHub
  if grep -q '"github"' .mcp.json 2>/dev/null; then
    echo "  ✅ GitHub MCP configured"
  else
    echo "  ⚠️  GitHub not configured"
  fi

  # Check Supabase
  if grep -q '"supabase"' .mcp.json 2>/dev/null; then
    echo "  ✅ Supabase MCP configured"
  fi

  # Check Context7
  if grep -q '"context7"' .mcp.json 2>/dev/null; then
    echo "  ✅ Context7 MCP configured (latest framework/library documentation)"
  else
    echo "  ℹ️  Context7 not configured (optional - provides latest docs)"
  fi

  # Remind user to check .env
  echo "  ℹ️  Remember: Add your real tokens to .env (not .mcp.json!)"
  echo "  ℹ️  Then restart Claude Code for MCP servers to load"
else
  echo "❌ MCP not configured (.mcp.json not found)"
fi

# Check CI
[ -f .github/workflows/ci.yml ] && echo "✅ CI workflow exists" || echo "❌ CI workflow missing"

# Check hooks system (v2.19.0+)
if [ -d hooks ] && [ -f hooks/hooks.json ]; then
  echo "✅ Hooks system configured"
else
  echo "❌ Hooks system not configured"
fi

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
  - Context7: ✅ Configured / ❌ Not configured / ℹ️ Optional
CI Workflow: ✅ Configured / ❌ Not configured
Hooks System: ✅ Configured / ❌ Not configured (v2.19.0+)
```

INPUTS (ask only about missing/incomplete features)
Based on detection results above, ask ONLY about features that aren't fully configured:

- IF core system missing: "Initialize core AgileFlow structure? yes/no"

- **Git Attribution Preference** (ALWAYS ask on first setup):
  - "Disable Claude Code attribution in git commits? (Removes '🤖 Generated with Claude Code' and 'Co-Authored-By: Claude' from commit messages) yes/no"
  - **Why ask**: Many users prefer not to disclose AI usage in their git history due to:
    - Professional reputation concerns
    - Company policies against AI disclosure
    - Client perception issues
    - Personal preference for ownership
  - **If yes**: Add to CLAUDE.md a CRITICAL section instructing Claude to NEVER add attribution
  - **If no**: Claude will continue adding attribution as normal

- IF MCP not configured: "Enable MCP integrations? (Model Context Protocol for GitHub, Notion, Context7, etc.) yes/no"
  - IF yes: Ask which servers to enable: "Enable GitHub? yes/no", "Enable Notion? yes/no", "Enable Supabase? yes/no", "Enable Context7? (Latest framework/library documentation) yes/no"
- IF MCP partially configured:
  - IF .mcp.json has servers with placeholder tokens: Report what's missing (e.g., "GitHub token is still placeholder")
  - Print next steps: "To complete setup: 1) Edit .mcp.json with your real tokens, 2) Restart Claude Code"
- IF GitHub sync missing: "Create GitHub sync mapping? (requires GitHub MCP) yes/no"
- IF CI missing: "Create minimal CI workflow? yes/no"
- IF hooks not configured: "Set up hooks system? (event-driven automation) yes/no"

Skip asking about features that are already fully configured (just report them as ✅).

CREATE DIRECTORIES (if missing)
docs/{00-meta/{templates,guides,scripts},01-brainstorming/{ideas,sketches},02-practices/prompts/agents,03-decisions,04-architecture,05-epics,06-stories,07-testing/{acceptance,test-cases},08-project,09-agents/bus,10-research}
.github/workflows
hooks/
scripts/

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
- .mcp.json                               // AI-generated with ${VAR} syntax for configured MCP servers (gitignored)
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

**Step 1: Create MCP wrapper infrastructure**:
```bash
# Create wrapper directory
mkdir -p scripts/mcp-wrappers

# Copy wrapper script from plugin templates
cp ~/.claude-code/plugins/AgileFlow/templates/mcp-wrapper-load-env.sh scripts/mcp-wrappers/load-env.sh

# Make executable
chmod +x scripts/mcp-wrappers/load-env.sh
```

**Step 2: Create .mcp.json with wrapper approach**:
The AI will create `.mcp.json` in your project root using the wrapper approach (NO "env" blocks).

Example `.mcp.json`:
```json
{
  "mcpServers": {
    "github": {
      "command": "bash",
      "args": [
        "scripts/mcp-wrappers/load-env.sh",
        "npx",
        "-y",
        "@modelcontextprotocol/server-github"
      ]
    }
  }
}
```

**Step 3: Add your GitHub token to .env**:
Create or update `.env` file with your real GitHub PAT:
```bash
GITHUB_PERSONAL_ACCESS_TOKEN=ghp_your_actual_token_here
```

**⚠️ CRITICAL SECURITY - Wrapper Approach (NOT ${VAR} Substitution)**:
- ✅ Use wrapper script: "command": "bash", "args": ["scripts/mcp-wrappers/load-env.sh", ...]
- ✅ Wrapper loads .env and exports variables before running MCP server
- ✅ Store actual tokens in .env (NOT .mcp.json)
- ✅ BOTH .mcp.json AND .env MUST be in .gitignore
- ✅ Commit .mcp.json.example and .env.example (templates with wrapper approach)
- ❌ NEVER hardcode tokens in .mcp.json
- ❌ NEVER commit .mcp.json or .env to git

**Why wrapper approach?**
- OLD (broken): "env": {"VAR": "${VAR}"} - Expected Claude Code to load .env (it doesn't)
- NEW (works): Wrapper loads .env and exports vars before running MCP server

**Step 4: Create GitHub Sync Mapping**:
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

**Step 5: Auto-fix .gitignore to protect secrets** (CRITICAL - Auto-applied):
```bash
# Auto-add .mcp.json if not present
grep -E '^\\.mcp\\.json$' .gitignore 2>/dev/null || echo ".mcp.json" >> .gitignore

# Auto-add .env if not present
grep -E '^\\.env$' .gitignore 2>/dev/null || echo ".env" >> .gitignore

# Verify both are now protected
grep -E '\\.mcp\\.json|\\.env' .gitignore
```

**Note**: Setup automatically adds these to .gitignore if missing (no prompt needed - security critical).

**🔴 CRITICAL Step 6: RESTART CLAUDE CODE** (MANDATORY - DO NOT SKIP):
```
═══════════════════════════════════════════════════════════
🔴🔴🔴 YOU MUST RESTART CLAUDE CODE NOW! 🔴🔴🔴
═══════════════════════════════════════════════════════════

⚠️  MCP SERVERS ONLY LOAD ON STARTUP ⚠️

If you don't restart, your MCP integration will NOT work!
The wrapper script needs Claude Code to reload .mcp.json.

HOW TO RESTART:
1. Save all work (Cmd+S or Ctrl+S)
2. Quit Claude Code COMPLETELY (Cmd+Q on Mac, Ctrl+Q on Linux)
3. Wait 5 seconds (ensure process fully exits)
4. Start Claude Code again
5. Wait 5-10 seconds for MCP servers to initialize
6. Run /AgileFlow:validate-mcp to verify

DO THIS NOW - Your MCP integration won't work without it!
═══════════════════════════════════════════════════════════
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
✅ GitHub MCP configured (.mcp.json created with wrapper approach)
✅ MCP wrapper script deployed (scripts/mcp-wrappers/load-env.sh)
✅ .env template created (.env.example)
✅ .gitignore updated (.mcp.json AND .env excluded)
✅ GitHub sync mapping created
⚠️  You still need to configure YOUR GitHub token

Next steps for you:
1. Create GitHub PAT: https://github.com/settings/tokens (permissions: repo, read:org)
2. Edit .env and add your real token:
   GITHUB_PERSONAL_ACCESS_TOKEN=ghp_your_actual_token_here
3. DO NOT edit .mcp.json (wrapper loads .env automatically)
4. Verify BOTH .mcp.json AND .env are in .gitignore: grep -E '\\.mcp\\.json|\\.env' .gitignore
5. NEVER commit .mcp.json or .env (contain secrets!)

═══════════════════════════════════════════════════════════
6. 🔴🔴🔴 RESTART CLAUDE CODE NOW! (CRITICAL - DO NOT SKIP)
   Quit completely (Cmd+Q), wait 5 seconds, restart
   MCP servers ONLY load on startup!
═══════════════════════════════════════════════════════════

7. Validate setup: /AgileFlow:validate-mcp
8. Preview sync: /AgileFlow:github DRY_RUN=true
9. Perform sync: /AgileFlow:github

Next steps for team members:
1. Pull latest code (includes .mcp.json, wrapper script, and .env.example)
2. Create their own GitHub PAT
3. Copy template: cp .env.example .env
4. Edit .env with their real token
5. Verify .gitignore has .mcp.json and .env

═══════════════════════════════════════════════════════════
6. 🔴🔴🔴 RESTART CLAUDE CODE NOW! (CRITICAL - DO NOT SKIP)
   Quit completely (Cmd+Q), wait 5 seconds, restart
   MCP servers ONLY load on startup!
═══════════════════════════════════════════════════════════

7. Validate setup: /AgileFlow:validate-mcp
8. Start syncing: /AgileFlow:github
```

NOTION INTEGRATION SETUP VIA MCP (if enabled)
**IMPORTANT**: Notion integration uses Model Context Protocol (MCP) for tool access and requires a Notion API token. MCP provides a standardized interface to Notion's API.

**Prerequisites**:
1. Create a Notion integration at https://www.notion.so/my-integrations
2. Get your Integration Token (starts with `ntn_`)
3. Share your Notion databases with the integration

**Step 1: Create MCP wrapper infrastructure** (if not already created by GitHub setup):
```bash
# Create wrapper directory
mkdir -p scripts/mcp-wrappers

# Copy wrapper script from plugin templates
cp ~/.claude-code/plugins/AgileFlow/templates/mcp-wrapper-load-env.sh scripts/mcp-wrappers/load-env.sh

# Make executable
chmod +x scripts/mcp-wrappers/load-env.sh
```

**Step 2: Create .mcp.json with Notion server using wrapper approach**:
The AI will create `.mcp.json` with Notion MCP server configured using the wrapper approach (NO "env" blocks).

Example:
```json
{
  "mcpServers": {
    "notion": {
      "command": "bash",
      "args": [
        "scripts/mcp-wrappers/load-env.sh",
        "npx",
        "-y",
        "@notionhq/notion-mcp-server"
      ]
    }
  }
}
```

**Step 3: Add your Notion token to .env**:
Create or update `.env` file with your real Notion token:
```bash
NOTION_TOKEN=ntn_your_actual_token_here
```

**Step 3: Auto-fix .gitignore to protect secrets** (CRITICAL - Auto-applied):
```bash
# Auto-add .mcp.json if not present
grep -E '^\\.mcp\\.json$' .gitignore 2>/dev/null || echo ".mcp.json" >> .gitignore

# Auto-add .env if not present
grep -E '^\\.env$' .gitignore 2>/dev/null || echo ".env" >> .gitignore

# Verify both are now protected
grep -E '\\.mcp\\.json|\\.env' .gitignore
```

**Note**: Setup automatically adds these to .gitignore if missing (no prompt needed - security critical).

**🔴 CRITICAL Step 4: RESTART CLAUDE CODE** (MANDATORY - DO NOT SKIP):
```
═══════════════════════════════════════════════════════════
🔴🔴🔴 YOU MUST RESTART CLAUDE CODE NOW! 🔴🔴🔴
═══════════════════════════════════════════════════════════

⚠️  MCP SERVERS ONLY LOAD ON STARTUP ⚠️

If you don't restart, your Notion MCP integration will NOT work!
The wrapper script needs Claude Code to reload .mcp.json.

HOW TO RESTART:
1. Save all work (Cmd+S or Ctrl+S)
2. Quit Claude Code COMPLETELY (Cmd+Q on Mac, Ctrl+Q on Linux)
3. Wait 5 seconds (ensure process fully exits)
4. Start Claude Code again
5. Wait 5-10 seconds for MCP servers to initialize
6. Run /AgileFlow:validate-mcp to verify

DO THIS NOW - Your MCP integration won't work without it!
═══════════════════════════════════════════════════════════
```

**Step 5: Create AgileFlow Databases**
Run `/AgileFlow:notion MODE=setup` which will:
- Use MCP tools to create 3 databases (Epics, Stories, ADRs)
- Store database IDs in `docs/08-project/notion-sync-map.json`

**Step 6: Verify Setup**
```bash
# Check if MCP tools loaded
# Look for mcp__notion__* tools in Claude Code

# Test by running
/AgileFlow:notion DRY_RUN=true
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
✅ Notion MCP configured (.mcp.json created with wrapper approach)
✅ MCP wrapper script deployed (scripts/mcp-wrappers/load-env.sh)
✅ .env template created (.env.example)
✅ .gitignore updated (.mcp.json AND .env excluded)
⚠️  You still need to configure YOUR Notion token

Next steps for you:
1. Create Notion integration: https://www.notion.so/my-integrations
2. Edit .env and add your real token:
   NOTION_TOKEN=ntn_your_actual_token_here
3. DO NOT edit .mcp.json (wrapper loads .env automatically)
4. Verify BOTH .mcp.json AND .env are in .gitignore: grep -E '\\.mcp\\.json|\\.env' .gitignore
5. NEVER commit .mcp.json or .env (contain secrets!)
═══════════════════════════════════════════════════════════
6. 🔴🔴🔴 RESTART CLAUDE CODE NOW! (CRITICAL - DO NOT SKIP)
   Quit completely (Cmd+Q), wait 5 seconds, restart
   MCP servers ONLY load on startup!
═══════════════════════════════════════════════════════════
7. Create databases: /AgileFlow:notion MODE=setup
8. Preview sync: /AgileFlow:notion DRY_RUN=true
9. Perform initial sync: /AgileFlow:notion

Next steps for team members:
1. Pull latest code (includes .mcp.json, wrapper script, and .env.example)
2. Create their own Notion integration
3. Copy template: cp .env.example .env
4. Edit .env with their real token
5. Verify .gitignore has .mcp.json and .env
═══════════════════════════════════════════════════════════
6. 🔴🔴🔴 RESTART CLAUDE CODE NOW! (CRITICAL - DO NOT SKIP)
   Quit completely (Cmd+Q), wait 5 seconds, restart
   MCP servers ONLY load on startup!
═══════════════════════════════════════════════════════════
7. Share databases with their integration
8. Start syncing: /AgileFlow:notion
```

CONTEXT7 INTEGRATION SETUP VIA MCP (if enabled)
**IMPORTANT**: Context7 provides Claude with up-to-date, version-specific documentation and code examples from the source. This overcomes Claude's training data cutoff (January 2025) by fetching current framework/library documentation on-demand.

**What is Context7?**
- MCP server that fetches latest documentation for frameworks/libraries (React, Next.js, Vue, Python packages, etc.)
- Prevents hallucinated APIs and outdated code generation
- Works by pulling docs from npm, PyPI, and GitHub repositories
- Optional API key for higher rate limits and private repositories

**Prerequisites**:
- None required for basic usage (works with public repositories)
- Optional: Get API key at https://context7.com/dashboard for:
  - Higher rate limits
  - Private repository access
  - Priority support

**Step 1: Create MCP wrapper infrastructure** (if not already created):
```bash
# Create wrapper directory
mkdir -p scripts/mcp-wrappers

# Copy wrapper script from plugin templates
cp ~/.claude-code/plugins/AgileFlow/templates/mcp-wrapper-load-env.sh scripts/mcp-wrappers/load-env.sh

# Make executable
chmod +x scripts/mcp-wrappers/load-env.sh
```

**Step 2: Create .mcp.json with Context7 server using wrapper approach**:
Context7 MCP server reads from CONTEXT7_API_KEY environment variable (wrapper will export it).

Example:
```json
{
  "mcpServers": {
    "context7": {
      "command": "bash",
      "args": [
        "scripts/mcp-wrappers/load-env.sh",
        "npx",
        "-y",
        "@upstash/context7-mcp"
      ]
    }
  }
}
```

**Step 3: (Optional) Add your Context7 API key to .env**:
Context7 works WITHOUT an API key (standard rate limits). For higher limits, add to `.env`:
```bash
CONTEXT7_API_KEY=your_actual_api_key_here
```
Get key at: https://context7.com/dashboard

**Note**: The Context7 MCP server reads CONTEXT7_API_KEY from environment variables. The wrapper script will export it automatically.

**Step 3: Auto-fix .gitignore to protect secrets** (CRITICAL - Auto-applied):
```bash
# Auto-add .mcp.json if not present
grep -E '^\\.mcp\\.json$' .gitignore 2>/dev/null || echo ".mcp.json" >> .gitignore

# Auto-add .env if not present
grep -E '^\\.env$' .gitignore 2>/dev/null || echo ".env" >> .gitignore

# Verify both are now protected
grep -E '\\.mcp\\.json|\\.env' .gitignore
```

**Note**: Setup automatically adds these to .gitignore if missing (no prompt needed - security critical).

**🔴 CRITICAL Step 4: RESTART CLAUDE CODE** (MANDATORY - DO NOT SKIP):
```
═══════════════════════════════════════════════════════════
🔴🔴🔴 YOU MUST RESTART CLAUDE CODE NOW! 🔴🔴🔴
═══════════════════════════════════════════════════════════

⚠️  MCP SERVERS ONLY LOAD ON STARTUP ⚠️

If you don't restart, Context7 will NOT provide current documentation!
The wrapper script needs Claude Code to reload .mcp.json.

HOW TO RESTART:
1. Save all work (Cmd+S or Ctrl+S)
2. Quit Claude Code COMPLETELY (Cmd+Q on Mac, Ctrl+Q on Linux)
3. Wait 5 seconds (ensure process fully exits)
4. Start Claude Code again
5. Wait 5-10 seconds for MCP servers to initialize
6. Run /AgileFlow:validate-mcp to verify

DO THIS NOW - Context7 won't work without it!
═══════════════════════════════════════════════════════════
```

**Step 5: Update CLAUDE.md with Context7 usage instructions**:
Add this section to CLAUDE.md:
```markdown
## Context7 MCP Integration

**Purpose**: Access up-to-date framework/library documentation to overcome Claude's training data cutoff (January 2025).

**When to use Context7**:
- ✅ When working with frameworks/libraries where API may have changed since January 2025
- ✅ When implementing features using newer package versions
- ✅ When user mentions specific library versions (e.g., "React 19", "Next.js 15")
- ✅ When encountering deprecation warnings or outdated patterns
- ✅ When you're uncertain about current best practices for a library

**How to use Context7**:
Before generating code for modern frameworks/libraries, mentally note: "Should I check latest docs via Context7?"

Examples:
- "Let me check the latest React 19 documentation for the new `use()` hook"
- "I'll verify the current Next.js 15 App Router patterns"
- "Let me fetch the latest Tailwind CSS utility classes"

**Available tools** (via MCP):
- Context7 tools are available as mcp__context7__* when you need them
- The system automatically fetches relevant documentation when you reference it

**Best practices**:
1. Use Context7 when working with packages released/updated after January 2025
2. Verify current API signatures before generating code
3. Check for deprecated patterns that may have been current in your training data
4. Mention to users when you've verified current documentation: "I've checked the latest docs and..."

**Rate limits**:
- Without API key: Standard rate limits (sufficient for most projects)
- With API key (CONTEXT7_API_KEY in .env): Higher limits + private repos
```

**Step 6: Verify Setup**:
Context7 will automatically provide docs when you work with frameworks/libraries. No manual commands needed - it works transparently when you mention library names or versions.

**Advantages of Context7**:
- ✅ Overcomes Claude's training data cutoff (January 2025)
- ✅ Provides version-specific documentation
- ✅ Prevents hallucinated/outdated APIs
- ✅ Supports npm, PyPI, GitHub docs
- ✅ Works without API key for public repos
- ✅ Optional API key for higher limits + private repos

**For Team Setup**:
1. One person adds Context7 to .mcp.json.example
2. Commit .mcp.json.example to git (with ${VAR} syntax)
3. Ensure .mcp.json and .env are in .gitignore
4. Update CLAUDE.md with Context7 usage instructions
5. Team members:
   - Pull latest code
   - Copy templates: cp .mcp.json.example .mcp.json && cp .env.example .env
   - OPTIONAL: Get API key from https://context7.com/dashboard
   - OPTIONAL: Add CONTEXT7_API_KEY to .env (skip if using standard rate limits)
   - Verify .gitignore has .mcp.json and .env
   - Restart Claude Code
   - Start getting current docs automatically!

**Print Next Steps**:
```
✅ Context7 MCP configured (.mcp.json created)
✅ CLAUDE.md updated with Context7 usage instructions
✅ .gitignore verified (.mcp.json AND .env excluded)
ℹ️  Context7 works WITHOUT an API key (standard rate limits)

Next steps for you:
1. OPTIONAL: Get API key for higher limits: https://context7.com/dashboard
2. OPTIONAL: Edit .env and add: CONTEXT7_API_KEY=your_key_here
3. Verify .gitignore has .mcp.json and .env: grep -E '\\.mcp\\.json|\\.env' .gitignore
═══════════════════════════════════════════════════════════
4. 🔴🔴🔴 RESTART CLAUDE CODE NOW! (CRITICAL - DO NOT SKIP)
   Quit completely (Cmd+Q), wait 5 seconds, restart
   MCP servers ONLY load on startup!
═══════════════════════════════════════════════════════════ (to load Context7 MCP server)
5. Context7 will now provide current docs automatically!

Next steps for team members:
1. Pull latest code (includes .mcp.json and .env.example)
2. Copy template: cp .env.example .env
3. OPTIONAL: Get their own API key and add to .env
4. Verify .gitignore has .mcp.json and .env
═══════════════════════════════════════════════════════════
5. 🔴🔴🔴 RESTART CLAUDE CODE NOW! (CRITICAL - DO NOT SKIP)
   Quit completely (Cmd+Q), wait 5 seconds, restart
   Hooks/MCP ONLY load on startup!
═══════════════════════════════════════════════════════════
6. Start getting current docs automatically!

Note: Context7 works transparently - no manual commands needed. Claude will automatically access current documentation when working with frameworks/libraries.
```

HOOKS SYSTEM SETUP (v2.19.0+) - If Enabled
**IMPORTANT**: Hooks allow event-driven automation in Claude Code. When Claude Code lifecycle events occur (SessionStart, UserPromptSubmit, Stop), hooks automatically execute shell commands.

**What Are Hooks?**
- **SessionStart**: Runs when Claude Code session starts (welcome messages, context preloading)
- **UserPromptSubmit**: Runs after user submits a prompt (logging, analytics)
- **Stop**: Runs when Claude stops responding (cleanup, notifications)

**Step 1: Create hooks directory and scripts directory**:
```bash
mkdir -p hooks scripts
```

**Step 2: Copy get-env.js helper script**:
Copy from AgileFlow plugin's `scripts/get-env.js` to `scripts/get-env.js`:
```javascript
#!/usr/bin/env node
/**
 * get-env.js - Dynamic environment variable helper for hooks
 * Usage: node scripts/get-env.js VARIABLE_NAME [default_value]
 */
const fs = require('fs');
const path = require('path');

const varName = process.argv[2];
const defaultValue = process.argv[3] || '';

if (!varName) {
  console.error('Usage: node scripts/get-env.js VARIABLE_NAME [default_value]');
  process.exit(1);
}

const projectDir = process.cwd();
const claudePath = path.join(projectDir, '.claude');
let env = {};

// Read settings.json (base configuration)
try {
  const settingsPath = path.join(claudePath, 'settings.json');
  const settings = JSON.parse(fs.readFileSync(settingsPath, 'utf8'));
  if (settings.env) {
    env = { ...env, ...settings.env };
  }
} catch (e) {}

// Read settings.local.json (local overrides - gitignored)
try {
  const localSettingsPath = path.join(claudePath, 'settings.local.json');
  const localSettings = JSON.parse(fs.readFileSync(localSettingsPath, 'utf8'));
  if (localSettings.env) {
    env = { ...env, ...localSettings.env };
  }
} catch (e) {}

const finalValue = env[varName] !== undefined ? env[varName] : defaultValue;
console.log(finalValue);
```
Make executable: `chmod +x scripts/get-env.js`

**Step 3: Create basic hooks.json**:
Create `hooks/hooks.json` with welcome message:
```json
{
  "hooks": {
    "SessionStart": [
      {
        "matcher": "",
        "hooks": [
          {
            "type": "command",
            "command": "echo '🚀 AgileFlow loaded - Type /AgileFlow:help to see available commands'"
          }
        ]
      }
    ],
    "UserPromptSubmit": [],
    "Stop": []
  }
}
```

**Step 4: Auto-fix .gitignore for hooks and .claude directories** (Auto-applied):
```bash
# Auto-add hooks files if not present
grep -E '^hooks/hooks\\.json$' .gitignore 2>/dev/null || echo "hooks/hooks.json" >> .gitignore
grep -E '^hooks/hooks\\.local\\.json$' .gitignore 2>/dev/null || echo "hooks/hooks.local.json" >> .gitignore

# Auto-add .claude directory if not present
grep -E '^\\.claude/' .gitignore 2>/dev/null || echo ".claude/" >> .gitignore
```

**Note**: Setup automatically adds these to .gitignore if missing (user-specific config files).

**Step 5: Create .claude directory structure** (for settings):
```bash
mkdir -p .claude
```

**Step 6: Create example settings.json template**:
Create `.claude/settings.example.json` (commit to git):
```json
{
  "env": {
    "USER_NAME": "Your Name",
    "PROJECT_NAME": "Your Project"
  }
}
```

**Step 7: Update CLAUDE.md with hooks documentation**:
Add this section to project's CLAUDE.md:
```markdown
## Hooks System (AgileFlow v2.19.0+)

AgileFlow supports event-driven automation through hooks. Hooks are automatically triggered when Claude Code lifecycle events occur.

### Configured Hooks

**SessionStart Hook**:
- Displays welcome message when Claude Code starts
- Current hook: Shows "🚀 AgileFlow loaded" message
- Located in: hooks/hooks.json

### Customizing Hooks

**To customize hooks**:
1. Edit `hooks/hooks.json`
2. Add commands to SessionStart, UserPromptSubmit, or Stop events
3. Restart Claude Code to apply changes

**Example - Add project context loading**:
```json
{
  "SessionStart": [{
    "hooks": [
      {
        "command": "echo 'Project: $(node scripts/get-env.js PROJECT_NAME)'"
      }
    ]
  }]
}
```

**Example - Activity logging**:
```json
{
  "UserPromptSubmit": [{
    "hooks": [{
      "command": "echo '[LOG] Prompt at $(date)' >> .claude/activity.log"
    }]
  }]
}
```

### Dynamic Environment Variables

Use `scripts/get-env.js` to load environment variables from `.claude/settings.json`:

**Create .claude/settings.json** (gitignored - your local config):
```json
{
  "env": {
    "USER_NAME": "Alice",
    "PROJECT_NAME": "MyApp"
  }
}
```

**Use in hooks**:
```json
{
  "command": "echo 'Welcome $(node scripts/get-env.js USER_NAME)!'"
}
```

Changes to `.claude/settings.json` take effect immediately (no restart needed).

### Security

- `hooks/hooks.json` is gitignored (user-specific)
- `.claude/settings.json` is gitignored (local overrides)
- `.claude/settings.example.json` is committed (template for team)

See AgileFlow plugin documentation for advanced hooks patterns.
```

**Print Next Steps**:
```
✅ Hooks system configured
✅ hooks/hooks.json created with SessionStart welcome message
✅ scripts/get-env.js helper created
✅ .gitignore updated (hooks and .claude directories protected)
✅ .claude/ directory created for settings
✅ .claude/settings.example.json template created
✅ CLAUDE.md updated with hooks documentation

Next steps for you:
1. Customize hooks: Edit hooks/hooks.json
2. OPTIONAL: Create .claude/settings.json for dynamic environment variables
═══════════════════════════════════════════════════════════
3. 🔴🔴🔴 RESTART CLAUDE CODE NOW! (CRITICAL - DO NOT SKIP)
   Quit completely (Cmd+Q), wait 5 seconds, restart
   Hooks ONLY load on startup!
═══════════════════════════════════════════════════════════
4. Hooks will run automatically on SessionStart, UserPromptSubmit, Stop events

Next steps for team members:
1. Pull latest code (includes hooks/hooks.json and .claude/settings.example.json)
2. Customize their own hooks: Edit hooks/hooks.json locally
3. OPTIONAL: Create .claude/settings.json with their own values
═══════════════════════════════════════════════════════════
4. 🔴🔴🔴 RESTART CLAUDE CODE NOW! (CRITICAL - DO NOT SKIP)
   Quit completely (Cmd+Q), wait 5 seconds, restart
   MCP servers ONLY load on startup!
═══════════════════════════════════════════════════════════
5. Hooks will run automatically!

Note: Each team member can have different hooks - hooks/hooks.json is gitignored for personalization.
```

TOKEN VALIDATION (SECURE - Does NOT expose tokens)

**IMPORTANT**: Before or after MCP setup, validate that required tokens are present in .env WITHOUT exposing them.

**Validation Script** (safe, reads .env without displaying values):
```bash
#!/bin/bash

echo "🔐 Token Validation (Secure Check - No Tokens Exposed)"
echo "========================================================="

# Check if .env exists
if [ ! -f .env ]; then
  echo "❌ .env file NOT found"
  echo ""
  echo "To create .env, copy from template:"
  echo "  cp .env.example .env"
  echo "Then edit .env and add your real tokens (DO NOT COMMIT)"
  exit 1
fi

echo "✅ .env file found"
echo ""

# Check GitHub token (secure - doesn't print value)
if grep -q "^GITHUB_PERSONAL_ACCESS_TOKEN=" .env && ! grep -q "GITHUB_PERSONAL_ACCESS_TOKEN=$" .env; then
  TOKEN_VALUE=$(grep "^GITHUB_PERSONAL_ACCESS_TOKEN=" .env | cut -d'=' -f2)
  if [ -z "$TOKEN_VALUE" ] || [ "$TOKEN_VALUE" = "your_token_here" ] || [ "$TOKEN_VALUE" = "ghp_placeholder" ]; then
    echo "⚠️  GITHUB_PERSONAL_ACCESS_TOKEN is set but appears to be placeholder"
    echo "    → Replace with real token (starts with ghp_)"
  else
    echo "✅ GITHUB_PERSONAL_ACCESS_TOKEN is set (length: ${#TOKEN_VALUE})"
  fi
else
  echo "⚠️  GITHUB_PERSONAL_ACCESS_TOKEN not found in .env"
fi

echo ""

# Check Notion token (secure - doesn't print value)
if grep -q "^NOTION_TOKEN=" .env && ! grep -q "NOTION_TOKEN=$" .env; then
  TOKEN_VALUE=$(grep "^NOTION_TOKEN=" .env | cut -d'=' -f2)
  if [ -z "$TOKEN_VALUE" ] || [ "$TOKEN_VALUE" = "your_token_here" ] || [[ "$TOKEN_VALUE" == *"placeholder"* ]]; then
    echo "⚠️  NOTION_TOKEN is set but appears to be placeholder"
    echo "    → Replace with real token (starts with ntn_ or secret_)"
  else
    echo "✅ NOTION_TOKEN is set (length: ${#TOKEN_VALUE})"
  fi
else
  echo "ℹ️  NOTION_TOKEN not found in .env (optional if Notion not enabled)"
fi

echo ""

# Check Context7 token (secure - doesn't print value)
if grep -q "^CONTEXT7_API_KEY=" .env && ! grep -q "CONTEXT7_API_KEY=$" .env; then
  TOKEN_VALUE=$(grep "^CONTEXT7_API_KEY=" .env | cut -d'=' -f2)
  if [ -z "$TOKEN_VALUE" ] || [ "$TOKEN_VALUE" = "your_key_here" ] || [[ "$TOKEN_VALUE" == *"placeholder"* ]]; then
    echo "⚠️  CONTEXT7_API_KEY is set but appears to be placeholder"
    echo "    → Replace with real key (optional for higher rate limits)"
  else
    echo "✅ CONTEXT7_API_KEY is set (length: ${#TOKEN_VALUE})"
  fi
else
  echo "ℹ️  CONTEXT7_API_KEY not found in .env (optional)"
fi

echo ""
echo "🔒 Security Check:"
echo "✅ .mcp.json is in .gitignore: $(grep -q '^\\.mcp\\.json$' .gitignore && echo 'YES' || echo 'NO')"
echo "✅ .env is in .gitignore: $(grep -q '^\\.env$' .gitignore && echo 'YES' || echo 'NO')"
```

**When to Run Token Validation**:
1. **After Initial Setup**: Verify tokens are in place before using MCP features
2. **Before Running MCP Commands**: Check tokens before `/AgileFlow:github-sync`, `/AgileFlow:notion`, etc.
3. **Troubleshooting**: If MCP tools aren't working, validate tokens are present

**How to Use**:
1. Copy script to `docs/00-meta/scripts/validate-tokens.sh`
2. Make executable: `chmod +x docs/00-meta/scripts/validate-tokens.sh`
3. Run anytime: `bash docs/00-meta/scripts/validate-tokens.sh`

**Output Example** (secure - no tokens exposed):
```
🔐 Token Validation (Secure Check - No Tokens Exposed)
=========================================================
✅ .env file found

✅ GITHUB_PERSONAL_ACCESS_TOKEN is set (length: 40)
✅ NOTION_TOKEN is set (length: 28)
ℹ️  CONTEXT7_API_KEY not found in .env (optional)

🔒 Security Check:
✅ .mcp.json is in .gitignore: YES
✅ .env is in .gitignore: YES
```

**What This Does** (Security-First):
- ✅ Checks if .env exists (without reading it)
- ✅ Verifies tokens are present (without displaying values)
- ✅ Detects placeholder tokens (warns user to replace)
- ✅ Shows token length only (not actual value)
- ✅ Verifies .gitignore protection (.mcp.json and .env excluded)
- ❌ NEVER displays actual token values
- ❌ NEVER logs token contents
- ❌ NEVER prints tokens anywhere

**If Tokens Missing**:
```
⚠️  GITHUB_PERSONAL_ACCESS_TOKEN not found in .env

To fix:
1. Copy template: cp .env.example .env
2. Edit .env and add your real tokens
3. NEVER commit .env to git (must be in .gitignore)
4. RESTART Claude Code for MCP servers to reload
5. Run token validation again to confirm
```

**Integration with Setup**:
The setup command should call this validation script and prompt:
- "Would you like to validate MCP tokens now? (yes/no)"
- If yes: Run token validation and report results
- If any tokens missing/invalid: Show next steps
- Remind: "RESTART Claude Code after updating .env for changes to take effect"

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
      - Next: /AgileFlow:notion MODE=setup
    Supabase: ✅ Fully configured
      - ✅ .mcp.json has Supabase server configured
      - ✅ Token configured
      - Ready to use mcp__supabase__* tools

  CI Workflow: ✅ Already configured (skipped)

  Hooks System: 🆕 Newly configured (v2.19.0+)
    - Created hooks/hooks.json with SessionStart welcome message
    - Created scripts/get-env.js for dynamic environment variables
    - .gitignore updated (hooks and .claude directories protected)
    - CLAUDE.md updated with hooks documentation
    - Next: Restart Claude Code to load hooks

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
    5. Run: /AgileFlow:notion MODE=setup
  ```

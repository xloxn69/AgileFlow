---
description: Bootstrap entire AgileFlow system in current project
allowed-tools: Bash, Read, Edit, Write, Glob, Grep, TodoWrite
---

# setup-system

Scaffold the universal agile/docs-as-code system for this repository.

## Prompt

ROLE: System Scaffolder (Agile + Docs-as-Code)

OBJECTIVE
Create/update a universal agile/docs system that works in any repo. Be idempotent. Diff-first. Ask YES/NO before changing files or executing commands.

**CRITICAL FIRST STEP - CREATE TODO LIST**

Before doing anything else, use the TodoWrite tool to create a comprehensive task list. This prevents missing any configuration steps.

**Why TodoWrite is critical**:
- Claude has access to a TodoWrite tool that tracks tasks across the conversation
- Creating a todo list at the start ensures nothing is forgotten
- Each detection result should map to a todo item
- Mark items as in_progress → completed as you work

**Example todo list structure**:
```json
[
  {"content": "Detect current system status", "activeForm": "Detecting current system status", "status": "in_progress"},
  {"content": "Initialize core AgileFlow structure", "activeForm": "Initializing core AgileFlow structure", "status": "pending"},
  {"content": "Configure auto-archival system", "activeForm": "Configuring auto-archival system", "status": "pending"},
  {"content": "Set up hooks system", "activeForm": "Setting up hooks system", "status": "pending"},
  {"content": "Update CLAUDE.md with configuration", "activeForm": "Updating CLAUDE.md with configuration", "status": "pending"},
  {"content": "Validate final setup", "activeForm": "Validating final setup", "status": "pending"}
]
```

**Workflow**:
1. FIRST: Run detection phase (bash commands)
2. SECOND: Based on detection, create TodoWrite list with ALL missing components
3. THIRD: Ask user for preferences (one question at a time)
4. FOURTH: Work through todo list, marking items completed as you go
5. FINAL: Mark last todo as completed and display summary

DETECTION PHASE (run first, before asking anything)
Detect what's already configured and report status:

```bash
# Check core structure
[ -d docs/00-meta ] && echo "✅ Core docs structure exists" || echo "❌ Core docs structure missing"
[ -f docs/09-agents/status.json ] && echo "✅ Agent status tracking exists" || echo "❌ Agent status tracking missing"

# Check CI
[ -f .github/workflows/ci.yml ] && echo "✅ CI workflow exists" || echo "❌ CI workflow missing"

# Check hooks system (v2.19.0+)
if [ -d .claude ] && [ -f .claude/settings.json ]; then
  echo "✅ Hooks system configured"
else
  echo "❌ Hooks system not configured"
fi

# Check auto-archival system (v2.19.4+)
if [ -f scripts/archive-completed-stories.sh ] && grep -q "archive-completed-stories.sh" .claude/settings.json 2>/dev/null; then
  THRESHOLD=$(jq -r '.archival.threshold_days // "not configured"' docs/00-meta/agileflow-metadata.json 2>/dev/null)
  echo "✅ Auto-archival configured (threshold: $THRESHOLD days)"
else
  echo "❌ Auto-archival NOT configured (recommended for production)"
fi

# Check runtime detection
[ -f docs/00-meta/runtime.json ] && echo "✅ Runtime detected" || echo "❌ Runtime not detected"
```

**Display Status Summary First**:
```
📊 Current AgileFlow Setup Status:
==================================
Core System: ✅ Configured / ❌ Not configured
CI Workflow: ✅ Configured / ❌ Not configured
Hooks System: ✅ Configured / ❌ Not configured (v2.19.0+)
Auto-Archival: ✅ Configured (X days) / ❌ Not configured (v2.19.4+)
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

- IF CI missing: "Create minimal CI workflow? yes/no"
- IF hooks not configured: "Set up hooks system? (event-driven automation) yes/no"

Skip asking about features that are already fully configured (just report them as ✅).

CREATE DIRECTORIES (if missing)

**CRITICAL: Use Validation Script (v2.22.2+)**

AgileFlow provides a validation script to ensure all required directories are created properly. This prevents issues where some folders may be missed during manual setup.

**Step 1: Copy validation script from plugin**:
```bash
# Copy validation script from AgileFlow plugin to project
cp ~/.claude-code/plugins/AgileFlow/scripts/validate-setup.sh scripts/validate-setup.sh
chmod +x scripts/validate-setup.sh
```

**Step 2: Run validation script**:
```bash
bash scripts/validate-setup.sh
```

**What the validation script does**:
- Checks for all required directories in docs/ structure
- Creates any missing directories automatically
- Reports status of critical files (status.json, agileflow-metadata.json)
- Provides a comprehensive validation summary

**Required directories** (all created by validation script):
- docs/{00-meta/{templates,guides,scripts},01-brainstorming/{ideas,sketches},02-practices/prompts/agents,03-decisions,04-architecture,05-epics,06-stories,07-testing/{acceptance,test-cases},08-project,09-agents/bus,10-research}
- .github/workflows
- .claude/
- scripts/

**Alternative: Manual directory creation** (if validation script not available):
```bash
mkdir -p docs/{00-meta/{templates,guides,scripts},01-brainstorming/{ideas,sketches},02-practices/prompts/agents,03-decisions,04-architecture,05-epics,06-stories,07-testing/{acceptance,test-cases},08-project,09-agents/bus,10-research}
mkdir -p .github/workflows .claude scripts
```

**IMPORTANT - docs/02-practices Purpose**:
- docs/02-practices is for **USER'S CODEBASE practices** (NOT AgileFlow system practices)
- Examples: Styling conventions, typography standards, CSS architecture, component patterns, API design patterns
- AgileFlow system documentation goes in docs/00-meta/ (guides, templates, scripts)
- This distinction ensures clarity between "how we build the product" vs "how we use AgileFlow"

CREATE/SEED FILES (only if missing; never overwrite non-empty content)
- docs/README.md — map of all folders
- docs/context.md — one-page brief with managed sections (placeholders)
- docs/00-meta/{glossary.md,conventions.md}
- docs/00-meta/agileflow-metadata.json — copy from templates/agileflow-metadata.json, update timestamp and version
- docs/00-meta/templates/{README-template.md,story-template.md,epic-template.md,adr-template.md,agent-profile-template.md,comms-note-template.md,research-template.md}
- docs/00-meta/guides/worktrees.md — copy from templates/worktrees-guide.md (comprehensive git worktrees guide for context preservation)
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
- .gitignore                              // CRITICAL: MUST include .env (for secrets), plus generic: .env*, .DS_Store, .idea/, .vscode/, node_modules/, dist/, build/, coverage/
- .env.example                            // template file for environment variables
- docs/02-practices/prompts/commands-catalog.md // paste-ready list of all slash commands & prompts (print content at the end)
- **CLAUDE.md** — AI assistant configuration (create if missing, update if exists)

CLAUDE.MD GENERATION/UPDATE (CRITICAL)
**IMPORTANT**: CLAUDE.md is the AI assistant's primary configuration file. It MUST be created or updated based on user preferences.

**If CLAUDE.md does NOT exist**:
Create CLAUDE.md with:
1. Project placeholder sections (Build/Test Commands, Architecture, etc.)

**If CLAUDE.md already exists**:
- Check if it contains git attribution rules
- If user chose to disable attribution AND CLAUDE.md doesn't have the rule → Add it
- If user chose to keep attribution AND CLAUDE.md has the disable rule → Remove it

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
- Enables proper .gitignore for secrets (.env)

HOOKS SYSTEM SETUP (v2.19.0+) - If Enabled
**IMPORTANT**: Hooks allow event-driven automation in Claude Code. When Claude Code lifecycle events occur (SessionStart, UserPromptSubmit, Stop), hooks automatically execute shell commands.

**What Are Hooks?**
- **SessionStart**: Runs when Claude Code session starts (welcome messages, context preloading)
- **UserPromptSubmit**: Runs after user submits a prompt (logging, analytics)
- **Stop**: Runs when Claude stops responding (cleanup, notifications)

**Step 1: Create .claude and scripts directories**:
```bash
mkdir -p .claude scripts
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

**Step 3: Create basic Claude settings with hooks**:
Create `.claude/settings.json` with welcome message hook:
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

**Step 4: Auto-fix .gitignore for .claude directory** (Auto-applied):
```bash
# Auto-add .claude user-specific files if not present
grep -E '^\\.claude/settings\\.local\\.json$' .gitignore 2>/dev/null || echo ".claude/settings.local.json" >> .gitignore
grep -E '^\\.claude/prompt-log\\.txt$' .gitignore 2>/dev/null || echo ".claude/prompt-log.txt" >> .gitignore
grep -E '^\\.claude/session\\.log$' .gitignore 2>/dev/null || echo ".claude/session.log" >> .gitignore
grep -E '^\\.claude/activity\\.log$' .gitignore 2>/dev/null || echo ".claude/activity.log" >> .gitignore
grep -E '^\\.claude/context\\.log$' .gitignore 2>/dev/null || echo ".claude/context.log" >> .gitignore
grep -E '^\\.claude/hook\\.log$' .gitignore 2>/dev/null || echo ".claude/hook.log" >> .gitignore
```

**Note**: Setup automatically adds user-specific .claude files to .gitignore if missing. `.claude/settings.json` is committed to git (project-level config).

**Step 5: Create example settings.local.json template** (optional):
Create `.claude/settings.local.example.json` (commit to git):
```json
{
  "env": {
    "USER_NAME": "Your Name",
    "PROJECT_NAME": "Your Project"
  }
}
```

**Step 6: Update CLAUDE.md with hooks documentation**:
Add this section to project's CLAUDE.md:
```markdown
## Hooks System (AgileFlow v2.19.0+)

AgileFlow supports event-driven automation through Claude Code's official hooks system. Hooks are automatically triggered when Claude Code lifecycle events occur.

### Configured Hooks

**SessionStart Hook**:
- Displays welcome message when Claude Code starts
- Current hook: Shows "🚀 AgileFlow loaded" message
- Located in: .claude/settings.json

### Customizing Hooks

**To customize hooks**:
1. Edit `.claude/settings.json`
2. Add commands to SessionStart, UserPromptSubmit, or Stop events
3. Restart Claude Code to apply changes

**Example - Add project context loading**:
```json
{
  "hooks": {
    "SessionStart": [{
      "hooks": [
        {
          "type": "command",
          "command": "echo 'Project: $(node scripts/get-env.js PROJECT_NAME)'"
        }
      ]
    }]
  }
}
```

**Example - Activity logging**:
```json
{
  "hooks": {
    "UserPromptSubmit": [{
      "hooks": [{
        "type": "command",
        "command": "echo '[LOG] Prompt at $(date)' >> .claude/activity.log"
      }]
    }]
  }
}
```

### Dynamic Environment Variables

Use `scripts/get-env.js` to load environment variables from `.claude/settings.json` and `.claude/settings.local.json`:

**Create .claude/settings.local.json** (gitignored - your local config):
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
  "hooks": {
    "SessionStart": [{
      "hooks": [{
        "type": "command",
        "command": "echo 'Welcome $(node scripts/get-env.js USER_NAME)!'"
      }]
    }]
  }
}
```

Changes to `.claude/settings.local.json` take effect immediately (no restart needed).

### Security

- `.claude/settings.json` is committed (project-level config, shared with team)
- `.claude/settings.local.json` is gitignored (user-specific overrides)
- `.claude/settings.local.example.json` is committed (template for team)

See AgileFlow plugin documentation for advanced hooks patterns.
```

**Print Next Steps**:
```
✅ Hooks system configured
✅ .claude/settings.json created with SessionStart welcome message
✅ scripts/get-env.js helper created
✅ .gitignore updated (.claude user-specific files protected)
✅ .claude/ directory created for settings
✅ .claude/settings.local.example.json template created
✅ CLAUDE.md updated with hooks documentation

Next steps for you:
1. Customize hooks: Edit .claude/settings.json
2. OPTIONAL: Create .claude/settings.local.json for user-specific environment variables
═══════════════════════════════════════════════════════════
3. 🔴🔴🔴 RESTART CLAUDE CODE NOW! (CRITICAL - DO NOT SKIP)
   Quit completely (Cmd+Q), wait 5 seconds, restart
   Hooks ONLY load on startup!
═══════════════════════════════════════════════════════════
4. Hooks will run automatically on SessionStart, UserPromptSubmit, Stop events

Next steps for team members:
1. Pull latest code (includes .claude/settings.json project config)
2. OPTIONAL: Create .claude/settings.local.json with their own environment variable overrides
═══════════════════════════════════════════════════════════
3. 🔴🔴🔴 RESTART CLAUDE CODE NOW! (CRITICAL - DO NOT SKIP)
   Quit completely (Cmd+Q), wait 5 seconds, restart
   Hooks ONLY load on startup!
═══════════════════════════════════════════════════════════
4. Hooks will run automatically!

Note: .claude/settings.json is committed to git (shared config). Team members can create .claude/settings.local.json for personal overrides (gitignored).
```

AUTO-ARCHIVAL CONFIGURATION (v2.19.4+) - Story Status Management

**IMPORTANT**: As projects grow, `docs/09-agents/status.json` can exceed Claude Code's token limit (25k tokens), causing agents to fail reading it. Auto-archival solves this by moving old completed stories to an archive.

**The Problem**:
- status.json grows as stories complete
- Agents need to read status.json on every invocation
- File exceeds 25k token limit → agents break with "file too large" error
- Solution: Move old completed stories to status-archive.json

**Ask User for Archival Threshold**:
IF core system missing OR status.json not yet created, ask:
```
📦 Auto-Archival Configuration

How long should completed stories remain in active status before archiving?

1. 3 days (very aggressive - keeps status.json very small)
2. 7 days (weekly archival - recommended for fast-moving teams)
3. 14 days (bi-weekly archival - good balance)
4. 30 days (monthly archival - default, keeps recent context)
5. Custom (specify number of days)

Your choice (1-5): [WAIT FOR INPUT]
```

**Process User Choice**:
```bash
# Store choice in docs/00-meta/agileflow-metadata.json
case $CHOICE in
  1) DAYS=3 ;;
  2) DAYS=7 ;;
  3) DAYS=14 ;;
  4) DAYS=30 ;;
  5)
    echo "Enter custom days threshold: "
    read DAYS
    ;;
esac

# Update docs/00-meta/agileflow-metadata.json with archival config
METADATA_FILE="docs/00-meta/agileflow-metadata.json"
if [ -f "$METADATA_FILE" ]; then
  # Update existing metadata
  jq ".archival = {\"threshold_days\": $DAYS, \"enabled\": true} | .updated = \"$(date -u +"%Y-%m-%dT%H:%M:%SZ")\"" "$METADATA_FILE" > "${METADATA_FILE}.tmp" && mv "${METADATA_FILE}.tmp" "$METADATA_FILE"
else
  # Create new metadata (shouldn't happen if core system was set up)
  cat > "$METADATA_FILE" << EOF
{
  "version": "2.21.0",
  "created": "$(date -u +"%Y-%m-%dT%H:%M:%SZ")",
  "updated": "$(date -u +"%Y-%m-%dT%H:%M:%SZ")",
  "archival": {
    "threshold_days": $DAYS,
    "enabled": true
  }
}
EOF
fi

echo "✅ Configured $DAYS-day archival threshold in agileflow-metadata.json"
```

**Add Auto-Archival Hook to .claude/settings.json**:
```bash
# Read current .claude/settings.json
CURRENT_SETTINGS=$(cat .claude/settings.json)

# Add SessionStart hook for auto-archival check (if not already present)
if ! grep -q "archive-completed-stories.sh" .claude/settings.json 2>/dev/null; then
  # Add auto-archival hook to SessionStart
  # Script reads threshold from agileflow-metadata.json automatically
  jq '.hooks.SessionStart += [{
    "matcher": "",
    "hooks": [{
      "type": "command",
      "command": "bash scripts/archive-completed-stories.sh > /dev/null 2>&1 &"
    }]
  }]' .claude/settings.json > .claude/settings.json.tmp && mv .claude/settings.json.tmp .claude/settings.json

  echo "✅ Added auto-archival hook to .claude/settings.json"
else
  echo "✅ Auto-archival hook already exists"
fi
```

**Copy Scripts from Plugin**:
```bash
# Copy archival script from AgileFlow plugin
cp ~/.claude-code/plugins/AgileFlow/scripts/archive-completed-stories.sh scripts/archive-completed-stories.sh
chmod +x scripts/archive-completed-stories.sh
echo "✅ Deployed archival script: scripts/archive-completed-stories.sh"

# Copy compression script from AgileFlow plugin (v2.20.0+)
cp ~/.claude-code/plugins/AgileFlow/scripts/compress-status.sh scripts/compress-status.sh
chmod +x scripts/compress-status.sh
echo "✅ Deployed compression script: scripts/compress-status.sh"
```

**Update CLAUDE.md with Archival Documentation**:
Add this section to project's CLAUDE.md:
```markdown
## Auto-Archival System (AgileFlow v2.19.4+)

AgileFlow automatically manages `docs/09-agents/status.json` file size by archiving old completed stories to `docs/09-agents/status-archive.json`.

### Why Auto-Archival?

**The Problem**:
- status.json grows as stories complete (can reach 100KB+ in active projects)
- Agents must read status.json on every invocation
- Files >25k tokens cause agents to fail with "file too large" error
- This breaks all agent workflows

**The Solution**:
- Automatically move completed stories older than threshold to status-archive.json
- Keep only active work (ready, in-progress, blocked) + recent completions in status.json
- Agents work fast with small, focused status.json
- Full history preserved in archive (nothing deleted)

### Configuration

**Current Threshold**: $DAYS days (completed stories older than $DAYS days are archived)

**To change threshold**:
1. Edit `docs/00-meta/agileflow-metadata.json`:
   ```bash
   # Update threshold to 7 days
   jq '.archival.threshold_days = 7 | .updated = "'$(date -u +"%Y-%m-%dT%H:%M:%SZ")'"' docs/00-meta/agileflow-metadata.json > tmp.json && mv tmp.json docs/00-meta/agileflow-metadata.json
   ```
2. Changes take effect immediately (no restart needed)
3. Next SessionStart will use new threshold

### How It Works

**Auto-Archival Hook** (runs on SessionStart):
- Checks `docs/09-agents/status.json` size
- If large enough, runs: `bash scripts/archive-completed-stories.sh <DAYS>`
- Moves completed stories older than threshold to status-archive.json
- Updates status.json with only active + recent stories
- Runs silently in background (no interruption)

### File Structure

**docs/09-agents/status.json** (active work):
- Stories with status: ready, in-progress, blocked
- Completed stories within threshold (recent completions)
- Agents read this file (small, fast)

**docs/09-agents/status-archive.json** (historical):
- Completed stories older than threshold
- Full history preserved
- Agents rarely need to read this

### Troubleshooting

**If agents fail with "file too large"**:
1. Run manual archival: `bash scripts/archive-completed-stories.sh 7`
2. Reduce threshold in `docs/00-meta/agileflow-metadata.json` (e.g., 3 days instead of 30)
3. Verify auto-archival hook is in `hooks/hooks.json`

**To view archived stories**:
```bash
# List all archived stories
jq '.stories | keys[]' docs/09-agents/status-archive.json

# View specific archived story
jq '.stories["US-0042"]' docs/09-agents/status-archive.json
```
```

**Print Configuration Summary**:
```
✅ Auto-Archival System configured
✅ Threshold: $DAYS days
✅ Archive script deployed: scripts/archive-completed-stories.sh
✅ Compression script deployed: scripts/compress-status.sh (v2.20.0+)
✅ Auto-archival hook added to .claude/settings.json
✅ Settings saved to docs/00-meta/agileflow-metadata.json
✅ CLAUDE.md updated with archival documentation

How it works:
- Every time Claude Code starts (SessionStart hook)
- Script checks docs/09-agents/status.json size
- Reads threshold from docs/00-meta/agileflow-metadata.json
- If needed, archives completed stories older than $DAYS days
- Keeps status.json small and fast for agents
- Full history preserved in docs/09-agents/status-archive.json

Manual archival and compression:
- Archival: bash scripts/archive-completed-stories.sh (reads from metadata)
- Archival with custom threshold: bash scripts/archive-completed-stories.sh 7
- Compression: /AgileFlow:compress (strips verbose fields if archival isn't enough)
- View status: ls -lh docs/09-agents/status*.json

Configuration:
- Stored in: docs/00-meta/agileflow-metadata.json
- Change threshold: jq '.archival.threshold_days = 7' docs/00-meta/agileflow-metadata.json
- Takes effect immediately (no restart needed)

Next steps:
- Auto-archival runs automatically on SessionStart
- Monitor file sizes: ls -lh docs/09-agents/status*.json
- If status.json grows too large, reduce threshold or run manual archival
```

**Integration with Hooks System**:
- Auto-archival uses the hooks system configured above
- Runs silently in background on SessionStart
- No user interruption or prompts during normal usage
- Archives only when needed (status.json size triggers)

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
- A rendered "commands catalog" (all prompts) to paste into your tool's custom commands UI
- Final status summary showing what was:
  - ✅ Already configured (skipped)
  - 🆕 Newly configured (created in this run)
  - ⚠️ Partially configured (needs user action)

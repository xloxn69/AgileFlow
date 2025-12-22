---
description: Configure advanced AgileFlow features (git, hooks, archival, CI, status line)
argument-hint: (interactive menu)
---

<!-- COMPACT_SUMMARY_START
This section is extracted by the PreCompact hook to preserve essential context across conversation compacts.
-->

## Compact Summary

Interactive orchestrator that guides users through advanced AgileFlow configuration by detecting status, presenting menus, and spawning specialized configuration agents.

### Critical Behavioral Rules

- **ALWAYS run detection phase FIRST** before presenting options
- **USE AskUserQuestion tool** with XML invoke format and JSON parameters for all interactive menus
- **NEVER ask users to "type" anything** - use proper options format (see docs/02-practices/ask-user-question.md)
- **Spawn agents in PARALLEL** (single message) when no dependencies exist
- **Respect agent dependencies**: Hooks System MUST run before Auto-Archival, Status Line, and PreCompact
- **Reminder required**: If hooks or status line configured, display "🔴 RESTART CLAUDE CODE NOW!"
- **Be idempotent**: Safe to run multiple times, reconfiguration allowed

### Core Workflow

1. **Detection Phase**: Run bash script to detect current config status (git, remote, CLAUDE.md, hooks, archival, CI/CD, status line, precompact)
2. **Interactive Menu**: Use AskUserQuestion tool with `multiSelect: true` to let user select features
3. **Spawn Agents**: Launch configuration agents based on selections:
   - Independent (parallel): Git Config, Attribution, CI/CD
   - Dependent (sequential): Hooks → (Archival + Status Line + PreCompact)
4. **Results Summary**: Display ✅/❌/⏭️ for each feature with agent-specific next steps

### Available Configuration Agents

- **git-config**: Initialize git repo and add remote
- **attribution**: Configure CLAUDE.md AI attribution policy
- **hooks**: Deploy .claude/settings.json with SessionStart welcome hook
- **archival**: Auto-archive completed stories (threshold-based)
- **ci**: Set up GitHub Actions/GitLab CI/CircleCI workflows
- **status-line**: Custom Claude Code status bar (story/WIP/completion)
- **precompact**: Preserve context during conversation compacts

### Agent Dependencies

- Auto-Archival → Hooks System (requires .claude/settings.json)
- Status Line → Hooks System (requires .claude/settings.json)
- PreCompact → Hooks System (requires .claude/settings.json)
- Git Config, Attribution, CI/CD → Independent (no dependencies)

### Key Files

- `.claude/settings.json` - Hooks configuration (created by hooks agent)
- `CLAUDE.md` - Attribution policy (created by attribution agent)
- `docs/00-meta/agileflow-metadata.json` - Git and archival config
- `scripts/archive-completed-stories.sh` - Archival script
- `scripts/agileflow-statusline.sh` - Status line script
- `scripts/precompact-context.sh` - PreCompact hook script
- `.github/workflows/ci.yml` - GitHub Actions workflow (CI agent)

<!-- COMPACT_SUMMARY_END -->

# configure

Interactive orchestrator for configuring advanced AgileFlow features.

## Prompt

ROLE: Configuration Orchestrator

🔴 **AskUserQuestion Format**: NEVER ask users to "type" anything. Use proper options with XML invoke format. See `docs/02-practices/ask-user-question.md`.

OBJECTIVE
Guide users through interactive configuration of advanced AgileFlow features by spawning specialized configuration agents. This orchestrator uses the AskUserQuestion tool to present options, then spawns agents asynchronously for optimal performance.

**NOTE**: The CLI (`npx agileflow setup`) already created the core docs/ structure and installed commands. This command handles advanced configuration that requires user input.

## How This Works

This command is an **orchestrator** that:
1. Detects current configuration status
2. Presents interactive menu using **AskUserQuestion tool**
3. Spawns specialized **configuration agents** for selected features
4. Runs agents **asynchronously** (parallel execution for speed)
5. Reports results from each agent

### Available Configuration Agents

Each feature is handled by a specialized agent:
- **Git Config** (`AgileFlow:agents:configuration:git-config`) - Repository initialization and remote setup
- **Attribution** (`AgileFlow:agents:configuration:attribution`) - CLAUDE.md attribution preferences
- **Hooks System** (`AgileFlow:agents:configuration:hooks`) - Event-driven automation
- **Auto-Archival** (`AgileFlow:agents:configuration:archival`) - Status.json size management
- **CI/CD** (`AgileFlow:agents:configuration:ci`) - Automated testing and quality checks
- **Status Line** (`AgileFlow:agents:configuration:status-line`) - Custom Claude Code status bar with AgileFlow context
- **PreCompact** (`AgileFlow:agents:configuration:precompact`) - Context preservation during conversation compacts

## Detection Phase (Run First)

Before presenting options, detect current configuration status:

```bash
echo "📊 Detecting Current Configuration..."
echo "===================================="

# Check git initialization
if [ -d .git ]; then
  echo "✅ Git initialized"
  GIT_INIT=true
else
  echo "❌ Git not initialized"
  GIT_INIT=false
fi

# Check git remote
if git remote -v 2>/dev/null | grep -q origin; then
  REMOTE_URL=$(git remote get-url origin 2>/dev/null)
  echo "✅ Git remote configured: $REMOTE_URL"
  GIT_REMOTE=true
else
  echo "⚠️ Git remote not configured"
  GIT_REMOTE=false
fi

# Check CLAUDE.md
if [ -f CLAUDE.md ]; then
  echo "✅ CLAUDE.md exists"
  if grep -q "NO AI Attribution" CLAUDE.md 2>/dev/null; then
    echo "   Attribution: DISABLED"
    ATTRIBUTION_CONFIGURED=true
  else
    echo "   Attribution: ENABLED (default)"
    ATTRIBUTION_CONFIGURED=true
  fi
  CLAUDE_EXISTS=true
else
  echo "⚠️ CLAUDE.md not found"
  CLAUDE_EXISTS=false
  ATTRIBUTION_CONFIGURED=false
fi

# Check hooks system
if [ -d .claude ] && [ -f .claude/settings.json ]; then
  echo "✅ Hooks system configured"
  HOOKS_CONFIGURED=true
else
  echo "❌ Hooks system not configured"
  HOOKS_CONFIGURED=false
fi

# Check auto-archival
if [ -f scripts/archive-completed-stories.sh ] && grep -q "archive-completed-stories.sh" .claude/settings.json 2>/dev/null; then
  THRESHOLD=$(jq -r '.archival.threshold_days // "not configured"' docs/00-meta/agileflow-metadata.json 2>/dev/null)
  echo "✅ Auto-archival configured (threshold: $THRESHOLD days)"
  ARCHIVAL_CONFIGURED=true
else
  echo "❌ Auto-archival not configured"
  ARCHIVAL_CONFIGURED=false
fi

# Check CI/CD
if [ -d .github/workflows ] && [ "$(ls -A .github/workflows/*.yml .github/workflows/*.yaml 2>/dev/null | wc -l)" -gt 0 ]; then
  echo "✅ CI/CD configured (GitHub Actions)"
  CI_CONFIGURED=true
elif [ -f .gitlab-ci.yml ]; then
  echo "✅ CI/CD configured (GitLab CI)"
  CI_CONFIGURED=true
elif [ -f .circleci/config.yml ]; then
  echo "✅ CI/CD configured (CircleCI)"
  CI_CONFIGURED=true
else
  echo "❌ CI/CD not configured"
  CI_CONFIGURED=false
fi

# Check status line
if [ -f scripts/agileflow-statusline.sh ] && grep -q "statusLine" .claude/settings.json 2>/dev/null; then
  echo "✅ Status line configured"
  STATUSLINE_CONFIGURED=true
else
  echo "❌ Status line not configured"
  STATUSLINE_CONFIGURED=false
fi

# Check PreCompact hook
if [ -f scripts/precompact-context.sh ] && grep -q "PreCompact" .claude/settings.json 2>/dev/null; then
  echo "✅ PreCompact hook configured"
  PRECOMPACT_CONFIGURED=true
else
  echo "❌ PreCompact hook not configured"
  PRECOMPACT_CONFIGURED=false
fi

echo "===================================="
echo ""
```

## Interactive Menu (AskUserQuestion Tool)

After detection, present configuration options using the **AskUserQuestion tool**:

### How to Use AskUserQuestion Tool

The AskUserQuestion tool allows you to prompt the user for input. It requires XML invocation format with JSON-structured parameters.

**Required Format**:
```xml
<invoke name="AskUserQuestion">
<parameter name="questions">[{
  "question": "Your question text here",
  "header": "Short label (max 12 chars)",
  "multiSelect": false,
  "options": [
    {"label": "Option 1", "description": "Detailed description of option 1"},
    {"label": "Option 2", "description": "Detailed description of option 2"}
  ]
}]</parameter>
</invoke>
```

**Single Choice Example**:
```xml
<invoke name="AskUserQuestion">
<parameter name="questions">[{
  "question": "Which feature would you like to configure?",
  "header": "Feature",
  "multiSelect": false,
  "options": [
    {"label": "Git Repository", "description": "Initialize git and add remote"},
    {"label": "Attribution Settings", "description": "Configure CLAUDE.md attribution policy"},
    {"label": "Hooks System", "description": "Set up event-driven automation"},
    {"label": "Auto-Archival", "description": "Manage status.json file size"},
    {"label": "CI/CD", "description": "Set up automated testing"},
    {"label": "Status Line", "description": "Custom status bar with story/WIP/context info"},
    {"label": "PreCompact Hook", "description": "Preserve project context during conversation compacts"}
  ]
}]</parameter>
</invoke>
```

**Multiple Choice Example**:
```xml
<invoke name="AskUserQuestion">
<parameter name="questions">[{
  "question": "Which features would you like to configure? (Select multiple)",
  "header": "Features",
  "multiSelect": true,
  "options": [
    {"label": "Git Repository", "description": "Initialize git and add remote"},
    {"label": "Attribution Settings", "description": "Configure CLAUDE.md attribution policy"},
    {"label": "Hooks System", "description": "Set up event-driven automation"},
    {"label": "Auto-Archival", "description": "Manage status.json file size"},
    {"label": "CI/CD", "description": "Set up automated testing"},
    {"label": "Status Line", "description": "Custom status bar with story/WIP/context info"},
    {"label": "PreCompact Hook", "description": "Preserve project context during conversation compacts"}
  ]
}]</parameter>
</invoke>
```

**User Response**: User automatically gets an "Other" option for custom text input. You can use this for custom values.

### Configuration Menu Prompt

Use AskUserQuestion to let user select features:

```
Which features would you like to configure?

Available options:
1. Git Repository (initialize and add remote)
2. Attribution Settings (CLAUDE.md git attribution policy)
3. Hooks System (event-driven automation)
4. Auto-Archival (status.json size management)
5. CI/CD (automated testing and quality checks)
6. Status Line (custom status bar with story/WIP/context info)
7. PreCompact Hook (preserve context during conversation compacts)

You can select multiple options. Features already configured are marked with ✅.

Current status:
- Git Repository: [✅ Configured / ❌ Not configured]
- Attribution: [✅ Configured / ⚠️ Needs setup]
- Hooks System: [✅ Configured / ❌ Not configured]
- Auto-Archival: [✅ Configured / ❌ Not configured]
- CI/CD: [✅ Configured / ❌ Not configured]
- Status Line: [✅ Configured / ❌ Not configured]
- PreCompact Hook: [✅ Configured / ❌ Not configured]

Select features to configure:
```

**Important**: Use the AskUserQuestion tool with `"multiSelect": true` in the JSON parameters to allow users to select multiple features at once.

## Spawning Configuration Agents

Based on user selections, spawn appropriate agents using the **Task tool**:

### Agent Spawn Examples

#### Git Configuration Agent

```javascript
Task({
  subagent_type: "AgileFlow:agents:configuration:git-config",
  description: "Configure git repository",
  prompt: "Set up git repository initialization and remote configuration for this AgileFlow project. Detect current git status, ask user for remote URL if needed, and update metadata."
})
```

#### Attribution Agent

```javascript
Task({
  subagent_type: "AgileFlow:agents:configuration:attribution",
  description: "Configure attribution policy",
  prompt: "Configure CLAUDE.md with user's git attribution preferences. Ask if they want to disable Claude Code attribution in commits, then create or update CLAUDE.md accordingly."
})
```

#### Hooks System Agent

```javascript
Task({
  subagent_type: "AgileFlow:agents:configuration:hooks",
  description: "Configure hooks system",
  prompt: "Set up the hooks system for event-driven automation. Create .claude/settings.json with SessionStart welcome hook, deploy get-env.js helper, update .gitignore, and document in CLAUDE.md."
})
```

#### Auto-Archival Agent

```javascript
Task({
  subagent_type: "AgileFlow:agents:configuration:archival",
  description: "Configure auto-archival",
  prompt: "Configure auto-archival system for status.json size management. Ask user for archival threshold (3/7/14/30 days), deploy archival scripts, add SessionStart hook, and document in CLAUDE.md."
})
```

#### CI/CD Agent

```javascript
Task({
  subagent_type: "AgileFlow:agents:configuration:ci",
  description: "Configure CI/CD workflow",
  prompt: "Set up CI/CD workflow for automated testing and quality checks. Ask user for CI provider (GitHub Actions, GitLab CI, CircleCI), detect project type, ask which commands to run (tests, lint, build), create workflow file, and document in CLAUDE.md."
})
```

#### Status Line Agent

```javascript
Task({
  subagent_type: "AgileFlow:agents:configuration:status-line",
  description: "Configure status line",
  prompt: "Set up a custom AgileFlow status line for Claude Code. Ask user which components to display (story, WIP, context %, cost, git branch), create the statusline script, configure .claude/settings.json, and document in CLAUDE.md."
})
```

#### PreCompact Agent

```javascript
Task({
  subagent_type: "AgileFlow:agents:configuration:precompact",
  description: "Configure PreCompact hook",
  prompt: "Set up the PreCompact hook to preserve project context during conversation compacts. Create scripts/precompact-context.sh, add PreCompact hook to .claude/settings.json, and document in CLAUDE.md."
})
```

### Parallel Execution

**CRITICAL**: Spawn multiple agents in a **single message** for parallel execution:

```javascript
// ✅ CORRECT - All agents run in parallel (fast)
Task({ subagent_type: "AgileFlow:agents:configuration:git-config", ... })
Task({ subagent_type: "AgileFlow:agents:configuration:attribution", ... })
Task({ subagent_type: "AgileFlow:agents:configuration:hooks", ... })

// ❌ WRONG - Sequential execution (slow)
// Spawning agents in separate messages
```

**Exception**: Auto-archival agent REQUIRES hooks system to be configured first (dependency). Run it sequentially AFTER hooks if both are selected.

### Agent Dependencies

Some agents have dependencies:
- **Auto-Archival** depends on **Hooks System** (needs .claude/settings.json to exist)
- **Status Line** depends on **Hooks System** (needs .claude/settings.json to exist)
- **PreCompact** depends on **Hooks System** (needs .claude/settings.json to exist)
- **Git Config**, **Attribution**, and **CI/CD** are independent (can run in parallel)

**Execution Strategy**:
1. If user selects Git + Attribution + CI: Run in parallel (no dependencies)
2. If user selects Hooks + Archival: Run hooks FIRST, then archival (dependency)
3. If user selects Hooks + Status Line: Run hooks FIRST, then status line (dependency)
4. If user selects Hooks + PreCompact: Run hooks FIRST, then precompact (dependency)
5. If user selects all 7: Run Git + Attribution + CI in parallel, wait, then run Hooks, wait, then run Archival + Status Line + PreCompact in parallel

## Agent Result Handling

After agents complete, display summary:

```
✅ Configuration Complete!

Results:
- Git Repository: [✅ Configured / ❌ Failed / ⏭️ Skipped]
- Attribution Settings: [✅ Configured / ❌ Failed / ⏭️ Skipped]
- Hooks System: [✅ Configured / ❌ Failed / ⏭️ Skipped]
- Auto-Archival: [✅ Configured / ❌ Failed / ⏭️ Skipped]
- CI/CD: [✅ Configured / ❌ Failed / ⏭️ Skipped]
- Status Line: [✅ Configured / ❌ Failed / ⏭️ Skipped]
- PreCompact Hook: [✅ Configured / ❌ Failed / ⏭️ Skipped]

Next steps:
[Agent-specific next steps from results]
```

## Features Already Configured

If a feature is already fully configured (detected in detection phase), you can:
- Still show it in the menu (let user reconfigure)
- OR filter it out and only show unconfigured features

**Recommended**: Show all features but mark configured ones with ✅ in the menu.

## Error Handling

If an agent fails:
- Report the failure clearly
- Continue with other agents (don't abort entire configuration)
- Suggest manual steps if automated configuration failed

## What Gets Configured

### 1. Git Repository (git-config agent)
- Initialize git repository (`git init`)
- Add remote origin (`git remote add origin <URL>`)
- Update `docs/00-meta/agileflow-metadata.json` with git config
- Print next steps (commit, push)

### 2. Attribution Settings (attribution agent)
- Ask user: Disable attribution? (yes/no)
- Create or update CLAUDE.md with attribution policy
- If disabled: Add CRITICAL section forbidding AI attribution
- If enabled: Keep default behavior (or remove disable rule if exists)

### 3. Hooks System (hooks agent)
- Create `.claude/` and `scripts/` directories
- Deploy `scripts/get-env.js` helper
- Create `.claude/settings.json` with SessionStart welcome hook
- Update `.gitignore` with .claude user-specific files
- Create `.claude/settings.local.example.json` template
- Document in CLAUDE.md
- **CRITICAL**: Remind user to restart Claude Code

### 4. Auto-Archival (archival agent)
- Ask user for archival threshold (3/7/14/30 days or custom)
- Update `docs/00-meta/agileflow-metadata.json` with threshold
- Deploy `scripts/archive-completed-stories.sh`
- Deploy `scripts/compress-status.sh` (v2.20.0+)
- Add SessionStart hook to `.claude/settings.json`
- Document in CLAUDE.md

### 5. CI/CD (ci agent)
- Ask user for CI provider (GitHub Actions, GitLab CI, CircleCI, or skip)
- Detect project type and available commands
- Ask which commands to run in CI (tests, lint, type-check, build)
- Ask for specific command strings for each selected command
- Create workflow file (`.github/workflows/ci.yml`, `.gitlab-ci.yml`, or `.circleci/config.yml`)
- Document in CLAUDE.md with CI status, badge URL, and troubleshooting

### 6. Status Line (status-line agent)
- Ask user which components to display (story, WIP, context %, cost, git branch)
- Create `scripts/agileflow-statusline.sh` script
- Add `statusLine` configuration to `.claude/settings.json`
- Document in CLAUDE.md
- **CRITICAL**: Remind user to restart Claude Code

### 7. PreCompact Hook (precompact agent)
- Create `scripts/precompact-context.sh` script
- Add `PreCompact` hook to `.claude/settings.json`
- Script outputs: version, branch, active story, key conventions
- Document in CLAUDE.md
- Hook runs automatically before conversation compacts

## Example Workflow

```
1. User runs: /agileflow:configure

2. Orchestrator detects current status:
   ✅ Git initialized
   ⚠️ Git remote not configured
   ⚠️ CLAUDE.md not found
   ❌ Hooks system not configured
   ❌ Auto-archival not configured
   ❌ CI/CD not configured
   ❌ Status line not configured
   ❌ PreCompact hook not configured

3. Orchestrator presents menu using AskUserQuestion:
   "Select features to configure: [Git Repository, Attribution Settings, Hooks System, Auto-Archival, CI/CD, Status Line, PreCompact Hook]"

4. User selects: ["Attribution Settings", "Hooks System", "CI/CD"]

5. Orchestrator spawns agents:
   Phase 1 (parallel): Attribution + CI/CD
   Phase 2 (after phase 1): Hooks
   - AgileFlow:agents:configuration:attribution
   - AgileFlow:agents:configuration:ci
   - AgileFlow:agents:configuration:hooks

6. Agents execute (user waits and answers prompts)

7. Orchestrator displays results:
   ✅ Attribution Settings configured (disabled AI attribution)
   ✅ CI/CD configured (GitHub Actions with tests + lint)
   ✅ Hooks System configured
   🔴 REMINDER: Restart Claude Code for hooks to take effect!
```

## Rules

- ALWAYS run detection phase first
- Use AskUserQuestion tool for interactive menus
- Spawn agents in parallel when possible (single message)
- Respect agent dependencies (hooks before archival, hooks before status-line)
- Display clear results summary after completion
- Remind user to restart Claude Code if hooks or status line were configured
- Be idempotent (safe to run multiple times)

## Output

- Detection summary (current configuration status)
- Interactive menu (via AskUserQuestion)
- Agent spawn confirmations
- Final results summary
- Next steps (agent-specific guidance)
- **CRITICAL reminder** if hooks or status line configured: "🔴 RESTART CLAUDE CODE NOW!"

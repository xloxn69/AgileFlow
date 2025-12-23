---
description: Configure advanced AgileFlow features (git, hooks, archival, CI, status line)
argument-hint: [--profile=full|basic|minimal|none] [--enable/--disable=features] [--migrate]
---

<!-- COMPACT_SUMMARY_START -->

## Compact Summary

Configuration management with **profiles**, **enable/disable**, and **format migration**.

### Workflow (MUST FOLLOW)

1. **Run detection**: `node scripts/agileflow-configure.js --detect`
2. **If ⚠️ INVALID FORMAT shown**: Ask user to fix with `--migrate` BEFORE anything else
3. **Present options**: Profiles, enable/disable, or check status

### Quick Commands

```bash
node scripts/agileflow-configure.js --detect           # Check status
node scripts/agileflow-configure.js --migrate          # Fix format issues
node scripts/agileflow-configure.js --profile=full     # Enable all
node scripts/agileflow-configure.js --profile=none     # Disable all
node scripts/agileflow-configure.js --enable=stop      # Enable specific
node scripts/agileflow-configure.js --disable=archival # Disable specific
```

### Features

`sessionstart`, `precompact`, `stop`, `archival`, `statusline`

### Critical Rules

- **Check for format issues FIRST** - offer to fix before other options
- **Backup created** on migrate: `.claude/settings.json.backup`
- **Restart required** - always show red banner after changes

<!-- COMPACT_SUMMARY_END -->

# configure

Manage AgileFlow features with profiles, enable/disable, and format migration.

## Prompt

ROLE: Configuration Manager

## STEP 1: Always Run Detection First

```bash
node scripts/agileflow-configure.js --detect
```

**CRITICAL**: Check the output for format issues (⚠️ INVALID FORMAT).

## STEP 2: If Format Issues Detected → Offer Migration FIRST

If you see `⚠️ INVALID FORMAT` in the detection output, **immediately ask user about fixing**:

```xml
<invoke name="AskUserQuestion">
<parameter name="questions">[{
  "question": "Format issues detected in your settings! These will cause Claude Code errors. Fix them now?",
  "header": "Fix Issues",
  "multiSelect": false,
  "options": [
    {"label": "Yes, fix format issues (Recommended)", "description": "Migrate old formats to new Claude Code format. Creates backup first."},
    {"label": "No, skip for now", "description": "Continue with configuration (issues will remain)"}
  ]
}]</parameter>
</invoke>
```

If user says yes:
```bash
node scripts/agileflow-configure.js --migrate
```

## STEP 3: Configuration Options

After fixing issues (or if no issues), present main options:

```xml
<invoke name="AskUserQuestion">
<parameter name="questions">[{
  "question": "What would you like to do?",
  "header": "Configure",
  "multiSelect": false,
  "options": [
    {"label": "Quick setup (full profile)", "description": "Enable all features: hooks, archival, status line"},
    {"label": "Basic setup", "description": "SessionStart + PreCompact + Archival"},
    {"label": "Enable specific features", "description": "Choose which features to enable"},
    {"label": "Disable specific features", "description": "Choose which features to disable"},
    {"label": "Check current status only", "description": "Already done - no changes needed"}
  ]
}]</parameter>
</invoke>
```

## Profile Commands

**Use a profile:**

```bash
# Full - all features
node scripts/agileflow-configure.js --profile=full

# Basic - essential hooks + archival
node scripts/agileflow-configure.js --profile=basic

# Minimal - welcome + archival
node scripts/agileflow-configure.js --profile=minimal

# None - disable all AgileFlow features
node scripts/agileflow-configure.js --profile=none
```

**Option B: Enable/disable specific features**

```bash
# Enable features
node scripts/agileflow-configure.js --enable=sessionstart,precompact,stop

# Disable features
node scripts/agileflow-configure.js --disable=statusline

# Both at once
node scripts/agileflow-configure.js --enable=stop --disable=archival

# With custom archival days
node scripts/agileflow-configure.js --enable=archival --archival-days=14
```

## Profile Details

| Profile | SessionStart | PreCompact | Stop | Archival | StatusLine |
|---------|-------------|------------|------|----------|------------|
| `full` | ✅ | ✅ | ✅ | ✅ 7 days | ✅ |
| `basic` | ✅ | ✅ | ❌ | ✅ 7 days | ❌ |
| `minimal` | ✅ | ❌ | ❌ | ✅ 7 days | ❌ |
| `none` | ❌ | ❌ | ❌ | ❌ | ❌ |

## Interactive Mode (via /configure command)

When user runs `/configure` without arguments, present options:

```xml
<invoke name="AskUserQuestion">
<parameter name="questions">[{
  "question": "What would you like to do?",
  "header": "Configure",
  "multiSelect": false,
  "options": [
    {"label": "Quick setup (full profile)", "description": "Enable all features: hooks, archival, status line"},
    {"label": "Basic setup", "description": "SessionStart + PreCompact + Archival"},
    {"label": "Fix format issues", "description": "Migrate old/invalid settings formats"},
    {"label": "Enable specific features", "description": "Choose which features to enable"},
    {"label": "Disable specific features", "description": "Choose which features to disable"},
    {"label": "Check current status", "description": "See what's currently configured"}
  ]
}]</parameter>
</invoke>
```

Based on selection, run appropriate command.

## Feature Selection (when Enable/Disable selected)

```xml
<invoke name="AskUserQuestion">
<parameter name="questions">[{
  "question": "Which features?",
  "header": "Features",
  "multiSelect": true,
  "options": [
    {"label": "SessionStart Hook", "description": "Welcome display with project status"},
    {"label": "PreCompact Hook", "description": "Context preservation on compact"},
    {"label": "Stop Hook", "description": "Warns about uncommitted git changes"},
    {"label": "Archival", "description": "Auto-archive old completed stories"},
    {"label": "Status Line", "description": "Custom status bar"}
  ]
}]</parameter>
</invoke>
```

Map selections:
- "SessionStart Hook" → `sessionstart`
- "PreCompact Hook" → `precompact`
- "Stop Hook" → `stop`
- "Archival" → `archival`
- "Status Line" → `statusline`

## Format Migration Details

The script handles these migrations automatically:

**Hook string format:**
```json
// OLD (invalid)
"PreCompact": "./scripts/precompact-context.sh"

// NEW (valid)
"PreCompact": [{"matcher": "", "hooks": [{"type": "command", "command": "bash ./scripts/precompact-context.sh"}]}]
```

**StatusLine missing type:**
```json
// OLD (invalid)
"statusLine": {"command": "./scripts/statusline.sh", "refreshInterval": 5000}

// NEW (valid)
"statusLine": {"type": "command", "command": "./scripts/statusline.sh", "padding": 0}
```

## Metadata Tracking

The script updates `docs/00-meta/agileflow-metadata.json`:

```json
{
  "version": "2.41.0",
  "updated": "2025-12-22T...",
  "archival": {
    "enabled": true,
    "threshold_days": 7
  },
  "features": {
    "sessionstart": {"enabled": true, "version": "2.41.0", "at": "..."},
    "precompact": {"enabled": true, "version": "2.41.0", "at": "..."},
    "stop": {"enabled": true, "version": "2.41.0", "at": "..."},
    "archival": {"enabled": true, "version": "2.41.0", "at": "..."},
    "statusline": {"enabled": true, "version": "2.41.0", "at": "..."}
  }
}
```

## Complex Features (Spawn Agents)

For features needing extra user input, spawn specialized agents:

```javascript
// CI/CD - needs provider and commands
Task({
  subagent_type: "agileflow-configuration:ci",
  description: "Configure CI/CD",
  prompt: "Set up CI/CD workflow. Ask for provider (GitHub Actions, GitLab CI, CircleCI) and commands."
})

// Git config - needs remote URL
Task({
  subagent_type: "agileflow-configuration:git-config",
  description: "Configure git",
  prompt: "Set up git remote. Ask for URL."
})
```

## Rules

1. **Always show detection first** - User sees current state before changes
2. **Auto-migrate on enable** - Script fixes format issues automatically when enabling features
3. **Backup on migrate** - Creates `.claude/settings.json.backup`
4. **Restart reminder** - Always show red banner after changes

## Output Format

After configuration:

```
✅ Configuration Complete!

Enabled:
  ✅ sessionstart
  ✅ precompact
  ✅ stop

Disabled:
  ❌ archival
  ❌ statusline

═══════════════════════════════════════════════════════
🔴 RESTART CLAUDE CODE NOW!
   Quit completely, wait 5 seconds, restart
═══════════════════════════════════════════════════════
```

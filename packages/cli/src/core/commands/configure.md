---
description: Configure advanced AgileFlow features (git, hooks, archival, CI, status line)
argument-hint: [--profile=full|basic|minimal|none] [--enable/--disable=features] [--migrate] [--upgrade]
---

<!-- COMPACT_SUMMARY_START -->

## Compact Summary

Configuration management with **profiles**, **enable/disable**, **format migration**, and **upgrade detection**.

### Workflow (MUST FOLLOW)

1. **Run detection**: `node .agileflow/scripts/agileflow-configure.js --detect`
2. **If ⚠️ INVALID FORMAT shown**: Ask user to fix with `--migrate` BEFORE anything else
3. **If 🔄 OUTDATED shown**: Ask user to upgrade with `--upgrade`
4. **Present options**: Profiles, enable/disable, or check status

### Quick Commands

```bash
node .agileflow/scripts/agileflow-configure.js --detect             # Check status
node .agileflow/scripts/agileflow-configure.js --migrate            # Fix format issues
node .agileflow/scripts/agileflow-configure.js --upgrade            # Update outdated scripts
node .agileflow/scripts/agileflow-configure.js --profile=full       # Enable all
node .agileflow/scripts/agileflow-configure.js --profile=none       # Disable all
node .agileflow/scripts/agileflow-configure.js --enable=sessionstart  # Enable specific
node .agileflow/scripts/agileflow-configure.js --disable=archival   # Disable specific
```

**Note:** All scripts are located in `.agileflow/scripts/` - no files in project root `scripts/`.

### Features

`sessionstart`, `precompact`, `archival`, `statusline`, `autoupdate`

### Critical Rules

- **Check for format issues FIRST** - offer to fix before other options
- **Check for outdated scripts** - offer to upgrade if versions differ
- **Backup created** on migrate: `.claude/settings.json.backup`
- **Restart required** - always show red banner after changes

<!-- COMPACT_SUMMARY_END -->

# configure

Manage AgileFlow features with profiles, enable/disable, and format migration.

## Prompt

ROLE: Configuration Manager

## STEP 1: Always Run Detection First

```bash
node .agileflow/scripts/agileflow-configure.js --detect
```

**CRITICAL**: Check the output for format issues (⚠️ INVALID FORMAT).

## STEP 2: Handle Issues (Migration or Upgrade)

### If ⚠️ INVALID FORMAT detected → Offer Migration
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
node .agileflow/scripts/agileflow-configure.js --migrate
```

### If 🔄 OUTDATED detected → Offer Upgrade
```xml
<invoke name="AskUserQuestion">
<parameter name="questions">[{
  "question": "Outdated scripts detected! Your features were configured with an older AgileFlow version. Update them?",
  "header": "Upgrade",
  "multiSelect": false,
  "options": [
    {"label": "Yes, upgrade scripts (Recommended)", "description": "Re-deploy all enabled features with latest scripts."},
    {"label": "No, keep current versions", "description": "Continue with older scripts (may miss bug fixes)."}
  ]
}]</parameter>
</invoke>
```

If user says yes:
```bash
node .agileflow/scripts/agileflow-configure.js --upgrade
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
node .agileflow/scripts/agileflow-configure.js --profile=full

# Basic - essential hooks + archival
node .agileflow/scripts/agileflow-configure.js --profile=basic

# Minimal - welcome + archival
node .agileflow/scripts/agileflow-configure.js --profile=minimal

# None - disable all AgileFlow features
node .agileflow/scripts/agileflow-configure.js --profile=none
```

**Option B: Enable/disable specific features**

```bash
# Enable features
node .agileflow/scripts/agileflow-configure.js --enable=sessionstart,precompact

# Disable features
node .agileflow/scripts/agileflow-configure.js --disable=statusline

# Both at once
node .agileflow/scripts/agileflow-configure.js --enable=statusline --disable=archival

# With custom archival days
node .agileflow/scripts/agileflow-configure.js --enable=archival --archival-days=14
```

## Profile Details

| Profile | SessionStart | PreCompact | Archival | StatusLine |
|---------|-------------|------------|----------|------------|
| `full` | ✅ | ✅ | ✅ 30 days | ✅ |
| `basic` | ✅ | ✅ | ✅ 30 days | ❌ |
| `minimal` | ✅ | ❌ | ✅ 30 days | ❌ |
| `none` | ❌ | ❌ | ❌ | ❌ |

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
    {"label": "Archival", "description": "Auto-archive old completed stories"},
    {"label": "Status Line", "description": "Custom status bar"},
    {"label": "Auto-Update", "description": "Automatically update AgileFlow on session start"}
  ]
}]</parameter>
</invoke>
```

Map selections:
- "SessionStart Hook" → `sessionstart`
- "PreCompact Hook" → `precompact`
- "Archival" → `archival`
- "Status Line" → `statusline`
- "Auto-Update" → `autoupdate`

## Auto-Update Configuration

Enable auto-update to automatically update AgileFlow when a new version is available:

```bash
# Enable auto-update
node .agileflow/scripts/agileflow-configure.js --enable=autoupdate

# Or manually edit docs/00-meta/agileflow-metadata.json:
```

```json
{
  "updates": {
    "autoUpdate": true,
    "checkFrequency": "daily"
  }
}
```

**Check frequencies:** `hourly`, `daily`, `weekly`, `never`

## Format Migration Details

The script handles these migrations automatically:

**Hook string format:**
```json
// OLD (invalid)
"PreCompact": "./.agileflow/scripts/precompact-context.sh"

// NEW (valid)
"PreCompact": [{"matcher": "", "hooks": [{"type": "command", "command": "bash ./.agileflow/scripts/precompact-context.sh"}]}]
```

**StatusLine missing type:**
```json
// OLD (invalid)
"statusLine": {"command": "./.agileflow/scripts/statusline.sh", "refreshInterval": 5000}

// NEW (valid)
"statusLine": {"type": "command", "command": "./.agileflow/scripts/statusline.sh", "padding": 0}
```

## Metadata Tracking

The script updates `docs/00-meta/agileflow-metadata.json`:

```json
{
  "version": "2.71.0",
  "updated": "2025-12-29T...",
  "archival": {
    "enabled": true,
    "threshold_days": 7
  },
  "features": {
    "sessionstart": {"enabled": true, "version": "2.71.0", "at": "..."},
    "precompact": {"enabled": true, "version": "2.71.0", "at": "..."},
    "archival": {"enabled": true, "version": "2.71.0", "at": "..."},
    "statusline": {"enabled": true, "version": "2.71.0", "at": "..."}
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
  ✅ archival

Disabled:
  ❌ statusline

═══════════════════════════════════════════════════════
🔴 RESTART CLAUDE CODE NOW!
   Quit completely, wait 5 seconds, restart
═══════════════════════════════════════════════════════
```

After upgrade:

```
🔄 Upgrading Outdated Features...

Upgrading sessionstart...
✅ Deployed agileflow-welcome.js
✅ SessionStart hook enabled

Upgrading precompact...
✅ Deployed precompact-context.sh
✅ PreCompact hook enabled

✅ Upgraded 2 feature(s) to v2.71.0
```

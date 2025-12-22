# Hooks System

AgileFlow supports **event-driven automation** through Claude Code's official hooks system.

---

## What Are Hooks?

Hooks are automatic triggers that execute commands in response to events:

| Event | When It Fires |
|-------|---------------|
| `SessionStart` | When Claude Code session begins |
| `PreCompact` | Before conversation is compacted |
| `UserPromptSubmit` | After you submit a prompt |
| `Stop` | When Claude stops responding |

---

## Quick Setup

### 1. Create Configuration

```bash
mkdir -p .claude
```

### 2. Add Hooks Configuration

Edit `.claude/settings.json`:

```json
{
  "hooks": {
    "SessionStart": [{
      "hooks": [{
        "type": "command",
        "command": "bash scripts/agileflow-statusline.sh"
      }]
    }]
  }
}
```

### 3. Restart Claude Code

Hooks take effect on next session start.

---

## Example Configurations

### Welcome Message

```json
{
  "hooks": {
    "SessionStart": [{
      "hooks": [{
        "type": "command",
        "command": "echo 'Welcome! Type /agileflow:help to get started'"
      }]
    }]
  }
}
```

### Status Line Display

```json
{
  "hooks": {
    "SessionStart": [{
      "hooks": [{
        "type": "command",
        "command": "bash scripts/agileflow-statusline.sh"
      }]
    }]
  }
}
```

### Auto-Archival

```json
{
  "hooks": {
    "SessionStart": [{
      "hooks": [{
        "type": "command",
        "command": "bash scripts/archive-completed-stories.sh"
      }]
    }]
  }
}
```

### PreCompact Context Preservation

```json
{
  "hooks": {
    "PreCompact": [{
      "hooks": [{
        "type": "command",
        "command": "bash scripts/precompact-context.sh"
      }]
    }]
  }
}
```

See [PreCompact Context](./precompact-context.md) for details.

### Activity Logging

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

---

## Configuration Files

| File | Purpose | Git |
|------|---------|-----|
| `.claude/settings.json` | Project-level config | Committed |
| `.claude/settings.local.json` | User-specific overrides | Gitignored |

User-specific settings override project settings.

---

## AgileFlow Hook Scripts

AgileFlow provides ready-to-use scripts:

| Script | Purpose |
|--------|---------|
| `scripts/agileflow-statusline.sh` | Display project status in status bar |
| `scripts/archive-completed-stories.sh` | Auto-archive old completed stories |
| `scripts/precompact-context.sh` | Preserve command context during compacts |
| `scripts/clear-active-command.js` | Clear active commands on session start |

---

## Configuration via AgileFlow

Use the configuration system to set up hooks interactively:

```
/agileflow:configure
```

Then select "Hooks" to configure event-driven automation.

See [Configuration System](./configuration-system.md) for details.

---

## Related Documentation

- [Configuration System](./configuration-system.md) - Interactive configuration
- [PreCompact Context](./precompact-context.md) - Context preservation
- [Session Harness](./session-harness.md) - Session management

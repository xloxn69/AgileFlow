# Configuration System

AgileFlow includes a unified configuration system with **8 specialized configuration agents**.

---

## Quick Access

```
/agileflow:configure
```

Opens an interactive menu to configure all AgileFlow features.

---

## Configuration Agents

| Agent | Purpose |
|-------|---------|
| `configuration:hooks` | Set up event-driven automation |
| `configuration:precompact` | Context preservation during conversation compacts |
| `configuration:status-line` | Custom Claude Code status bar |
| `configuration:git-config` | Git repository initialization and remote setup |
| `configuration:ci` | CI/CD workflow for automated testing and quality |
| `configuration:archival` | Auto-archival of completed stories |
| `configuration:attribution` | Git attribution preferences in CLAUDE.md |
| `configuration:verify` | Verify all configurations work correctly |

---

## Hooks Configuration

Set up event-driven automation for SessionStart, PreCompact, and other events.

**What it configures:**
- `.claude/settings.json` hooks section
- SessionStart welcome messages
- PreCompact context preservation
- Auto-archival triggers

See [Hooks System](./hooks-system.md) for details.

---

## PreCompact Configuration

Ensures command context survives conversation compaction.

**How it works:**
```
1. Command runs → Registers as "active"
2. Conversation compacts → PreCompact hook extracts rules
3. New context → Rules are preserved and followed
```

**What it configures:**
- PreCompact hook in settings
- `scripts/precompact-context.sh`
- Session state tracking

See [PreCompact Context](./precompact-context.md) for architecture details.

---

## Status Line Configuration

Display project context in Claude Code's status bar.

**Example output:**
```
[main] US-0007: Login Feature | WIP: 2 | Done: 85%
```

**Components:**
- Git branch (colored by type)
- Current story
- WIP count
- Completion percentage

**What it configures:**
- `statusLine` in `.claude/settings.json`
- `scripts/agileflow-statusline.sh`

---

## Git Configuration

Initialize git repository and configure remotes.

**What it configures:**
- Git repository initialization
- Remote origin setup
- Branch configuration

---

## CI Configuration

Set up CI/CD workflow for automated testing.

**What it configures:**
- `.github/workflows/ci.yml`
- Test automation
- Quality checks
- Coverage reporting

---

## Archival Configuration

Auto-archive completed stories to keep status.json lean.

**How it works:**
- Stories with `status: "completed"` older than threshold are archived
- Archived to `docs/09-agents/archive/YYYY-MM.json`
- Runs automatically on session start

**Configuration options:**
- `threshold_days`: Days before archiving (default: 7)
- `enabled`: Enable/disable auto-archival

Stored in `docs/00-meta/agileflow-metadata.json`.

---

## Attribution Configuration

Configure git attribution preferences.

**What it configures:**
- CLAUDE.md attribution section
- Commit message preferences
- Co-authored-by settings

---

## Verify Configuration

Verify all configurations work correctly.

**What it checks:**
- Hooks are properly configured
- Scripts exist and are executable
- Settings files are valid JSON
- Required directories exist

---

## Configuration Files

| File | Purpose |
|------|---------|
| `.claude/settings.json` | Claude Code settings (hooks, permissions, status line) |
| `.claude/settings.local.json` | User-specific overrides (gitignored) |
| `docs/00-meta/agileflow-metadata.json` | AgileFlow-specific configuration |
| `CLAUDE.md` | Project system prompt and attribution |

---

## Related Documentation

- [Hooks System](./hooks-system.md) - Event-driven automation
- [PreCompact Context](./precompact-context.md) - Context preservation
- [Session Harness](./session-harness.md) - Session management

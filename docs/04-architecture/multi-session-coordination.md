# Multi-Session Coordination System

Enables zero-friction parallel Claude Code sessions with automatic conflict detection and git worktree automation.

---

## The Problem

When working on the same repo with multiple Claude Code sessions:
- All instances write to `~/.claude/` with no process isolation
- File locking conflicts cause freezes (especially on macOS)
- No visibility into what other sessions are working on
- Risk of conflicting edits to the same files
- Manual worktree setup is tedious and error-prone

---

## The Solution

Multi-Session Coordination provides:
- **Session Registry**: Numbered IDs (1, 2, 3...) with metadata
- **PID-Based Locking**: Detect active sessions, clean up stale locks
- **Git Worktree Automation**: One command creates isolated workspace
- **Conflict Detection**: Warning on startup if other sessions active
- **Interactive Management**: AskUserQuestion-based session switching

---

## Quick Start

```bash
# See session status
/agileflow:session:status

# Create parallel workspace
/agileflow:session:new

# Switch to another session
/agileflow:session:resume

# End current session
/agileflow:session:end
```

---

## Architecture Overview

```
┌─────────────────────────────────────────────────────────────────┐
│                    USER OPENS CLAUDE CODE                        │
└──────────────────────────────┬──────────────────────────────────┘
                               │
                               ▼
┌─────────────────────────────────────────────────────────────────┐
│              SessionStart Hook (agileflow-welcome.js)            │
│                                                                  │
│  1. Call session-manager.js register                            │
│  2. Call session-manager.js count                               │
│  3. Display session status in welcome table                     │
│  4. If conflicts: show warning + suggest /session:new           │
└──────────────────────────────┬──────────────────────────────────┘
                               │
              ┌────────────────┴────────────────┐
              ▼                                 ▼
     ┌─────────────────┐              ┌─────────────────────┐
     │  No Conflicts   │              │  Conflicts Found    │
     │                 │              │                     │
     │  ✓ Session 1    │              │  ⚠️ N other active  │
     │  (only)         │              │  + command tips     │
     └─────────────────┘              └─────────────────────┘
```

---

## Session Commands

| Command | Purpose |
|---------|---------|
| `/agileflow:session:new` | Create parallel session with git worktree |
| `/agileflow:session:resume` | Pick a session to switch to |
| `/agileflow:session:status` | View all sessions table |
| `/agileflow:session:end` | End current session cleanly |
| `/agileflow:session:history` | View session history |
| `/agileflow:session:init` | Initialize/verify session system |

---

## Key Files

| File | Purpose |
|------|---------|
| `.agileflow/sessions/registry.json` | Session registry with IDs, paths, metadata |
| `.agileflow/sessions/{id}.lock` | Lock file with PID for each active session |
| `packages/cli/scripts/session-manager.js` | Core session logic (register, create, list, delete) |
| `packages/cli/scripts/agileflow-welcome.js` | Welcome script with session detection |
| `packages/cli/src/core/commands/session/*.md` | Session slash commands |

---

## How It Works

### 1. Session Registry

Sessions are tracked in `.agileflow/sessions/registry.json`:

```json
{
  "schema_version": "1.0.0",
  "next_id": 3,
  "project_name": "myproject",
  "sessions": {
    "1": {
      "path": "/home/user/myproject",
      "branch": "main",
      "story": "US-0042",
      "nickname": null,
      "created": "2025-12-26T10:00:00Z",
      "last_active": "2025-12-26T14:30:00Z",
      "is_main": true
    },
    "2": {
      "path": "/home/user/myproject-auth",
      "branch": "session-2",
      "story": "US-0038",
      "nickname": "auth",
      "created": "2025-12-26T12:00:00Z",
      "last_active": "2025-12-26T14:25:00Z",
      "is_main": false
    }
  }
}
```

### 2. PID-Based Locking

Each active session creates a lock file:

```
.agileflow/sessions/1.lock
.agileflow/sessions/2.lock
```

Lock file contents:
```
pid=12345
started=1703598000
```

**Liveness detection:**
```javascript
// Check if PID is still running
process.kill(pid, 0);  // Returns without error if alive
```

### 3. Stale Lock Cleanup

On startup, the system:
1. Reads all lock files
2. Checks if each PID is still alive
3. Removes locks for dead PIDs
4. Reports cleaned sessions

### 4. Git Worktree Integration

When `/session:new` creates a session:

```bash
# Create branch if needed
git branch session-2

# Create worktree
git worktree add ../myproject-2 session-2
```

Benefits:
- Isolated directory per session
- Shared `.git` (disk efficient)
- Independent branch per session
- No file conflicts possible

### 5. Welcome Script Integration

The welcome table shows session status:

```
╭──────────────────────┬────────────────────────────────────╮
│ agileflow v2.53.0  main (cc45511)                         │
├──────────────────────┼────────────────────────────────────┤
│ In Progress          │ 1                                  │
│ Sessions             │ ✓ Session 1 (only)                 │
│ ...                                                       │
╰──────────────────────┴────────────────────────────────────╯
```

If conflicts:
```
│ Sessions             │ ⚠️ 2 other active                   │

⚠️  Other Claude session(s) active in this repo.
   Run /agileflow:session:status to see all sessions.
   Run /agileflow:session:new to create isolated workspace.
```

---

## Session Manager API

The `session-manager.js` script provides these commands:

| Command | Description | Output |
|---------|-------------|--------|
| `register [nickname]` | Register current directory | `{"id":"1","isNew":true}` |
| `unregister <id>` | Remove session lock | `{"success":true}` |
| `create [--nickname X]` | Create worktree session | `{"success":true,"sessionId":"2","path":"..."}` |
| `list [--json]` | List all sessions | Table or JSON |
| `count` | Count other active sessions | `{"count":1}` |
| `delete <id> [--remove-worktree]` | Delete session | `{"success":true}` |
| `status` | Current session info | JSON with current + others |

---

## Workflow Examples

### Starting Fresh

```
User runs: claude
  → SessionStart hook fires
  → session-manager.js register
  → Creates registry.json (first time)
  → Registers Session 1
  → Welcome shows "✓ Session 1 (only)"
```

### Creating Parallel Session

```
User runs: /agileflow:session:new
  → AskUserQuestion: Auto-create / Name / Existing branch
  → User picks: "Auto-create Session 2"
  → session-manager.js create
  → Creates ../myproject-2 worktree
  → Creates session-2 branch
  → Shows: cd ../myproject-2 && claude
```

### Switching Sessions

```
User runs: /agileflow:session:resume
  → session-manager.js list --json
  → AskUserQuestion with session options
  → User picks: Session 2 "auth"
  → Shows: cd ../myproject-auth && claude --resume
```

---

## Design Decisions

### Why Numbered IDs?

- **Simple**: Easy to type ("2" vs "myproject-parallel-20251226")
- **Unique**: Auto-incrementing, no collisions
- **Stable**: ID doesn't change if branch changes

Nicknames are optional for human-friendly display.

### Why PID-Based Detection?

- **No daemon required**: Works with CLI tool
- **Cross-platform**: Works on Linux/macOS/Windows
- **Automatic cleanup**: Dead PIDs detected on next startup

Alternative considered: Heartbeat files (requires background process).

### Why Git Worktrees?

- **Recommended by Claude Code team**: Official solution for multi-session
- **Disk efficient**: Shared .git directory
- **Clean isolation**: No file conflicts possible
- **Native git**: Works with existing tooling

---

## Limitations

1. **Can't switch terminals automatically**: User must `cd` and run `claude`
2. **Requires git**: Worktrees need a git repository
3. **PID check delay**: Stale locks cleaned on next startup, not immediately
4. **Single machine**: Registry is local, doesn't sync across machines

---

## Related Documentation

- [Session Harness](./session-harness.md) - Test verification and continuity
- [Hooks System](./hooks-system.md) - SessionStart hook configuration
- [Commands](./commands.md) - All AgileFlow commands

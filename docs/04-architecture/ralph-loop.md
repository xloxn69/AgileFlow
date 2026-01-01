# Ralph Loop - Autonomous Execution System

**Research**: See [Claude Code Stop Hooks & Ralph Loop](../10-research/20260101-claude-code-stop-hooks-ralph-loop.md)

The Ralph Loop enables autonomous story processing through test-driven validation and automatic progression.

---

## Overview

```
┌─────────────────────────────────────────────────────────────┐
│                      RALPH LOOP FLOW                         │
├─────────────────────────────────────────────────────────────┤
│                                                              │
│  /agileflow:babysit EPIC=EP-0042 MODE=loop MAX=20           │
│                           │                                  │
│                           ▼                                  │
│  ┌─────────────────────────────────────────────────┐        │
│  │ ralph-loop.js --init                            │        │
│  │  → Find first "ready" story in epic             │        │
│  │  → Mark "in_progress"                           │        │
│  │  → Save loop state to session-state.json        │        │
│  └─────────────────────────────────────────────────┘        │
│                           │                                  │
│                           ▼                                  │
│  ┌─────────────────────────────────────────────────┐        │
│  │ Claude works on story...                        │◄──┐    │
│  └─────────────────────────────────────────────────┘   │    │
│                           │                             │    │
│                           ▼ (Claude stops)              │    │
│  ┌─────────────────────────────────────────────────┐   │    │
│  │ Stop Hook: ralph-loop.js                        │   │    │
│  │  → Run tests (npm test)                         │   │    │
│  │  → If PASS: mark complete, get next story ──────┼───┘    │
│  │  → If FAIL: show errors, continue fixing ───────┘        │
│  └─────────────────────────────────────────────────┘        │
│                           │                                  │
│                           ▼ (all stories done)              │
│  ┌─────────────────────────────────────────────────┐        │
│  │ EPIC COMPLETE                                    │        │
│  └─────────────────────────────────────────────────┘        │
│                                                              │
└─────────────────────────────────────────────────────────────┘
```

---

## Key Files

| File | Purpose |
|------|---------|
| `scripts/ralph-loop.js` | Main loop controller and Stop hook handler |
| `docs/09-agents/session-state.json` | Loop state storage |
| `docs/09-agents/status.json` | Story status tracking |
| `.claude/settings.json` | Stop hook configuration |

---

## Session State Schema

When loop mode is active, `session-state.json` contains:

```json
{
  "ralph_loop": {
    "enabled": true,
    "epic": "EP-0042",
    "current_story": "US-0015",
    "iteration": 3,
    "max_iterations": 20,
    "started_at": "2026-01-01T10:00:00Z",
    "last_failure": null
  }
}
```

---

## Stop Hook Chain

The Stop hook runs these scripts in order:

```json
{
  "hooks": {
    "Stop": [
      {
        "matcher": "",
        "hooks": [
          { "command": "node scripts/ralph-loop.js" },
          { "command": "node scripts/auto-self-improve.js" }
        ]
      }
    ]
  }
}
```

1. **ralph-loop.js** - Validates work, progresses stories
2. **auto-self-improve.js** - Records learnings to expertise files

---

## Loop States

| State | Description | Next Action |
|-------|-------------|-------------|
| `enabled: false` | Loop not active | Normal stop behavior |
| Tests pass | Story complete | Mark complete, load next story |
| Tests fail | Work incomplete | Show failures, continue fixing |
| Max iterations | Safety limit hit | Stop loop, notify user |
| No more stories | Epic complete | Celebrate, end loop |

---

## CLI Commands

```bash
# Initialize loop for an epic
node scripts/ralph-loop.js --init --epic=EP-0042 --max=20

# Check loop status
node scripts/ralph-loop.js --status

# Stop the loop manually
node scripts/ralph-loop.js --stop

# Reset loop state
node scripts/ralph-loop.js --reset
```

---

## Integration with Babysit

The babysit command supports loop mode via parameters:

```bash
/agileflow:babysit EPIC=EP-0042 MODE=loop MAX=20
```

| Parameter | Required | Default | Description |
|-----------|----------|---------|-------------|
| `EPIC` | Yes | - | Epic ID to process |
| `MODE` | Yes | - | Must be `loop` |
| `MAX` | No | 20 | Maximum iterations |

---

## Test Command Configuration

By default, `npm test` is used. Configure a custom command in metadata:

```json
// docs/00-meta/agileflow-metadata.json
{
  "ralph_loop": {
    "test_command": "npm run test:ci"
  }
}
```

---

## Safety Features

| Feature | Purpose |
|---------|---------|
| `max_iterations` | Prevents infinite loops |
| Silent when inactive | No output if loop not enabled |
| Iteration tracking | Shows progress (3/20) |
| Manual stop | `--stop` flag for emergency exit |
| Error tolerance | Hook failures don't break workflow |

---

## Use Cases

| Use Case | Configuration |
|----------|---------------|
| Sprint batch processing | `EPIC=EP-current MODE=loop MAX=50` |
| TDD implementation | Write tests, loop until pass |
| Overnight work | High MAX, let it run |
| Quick epic finish | Low MAX (5-10) for safety |

---

## Related Documentation

- [Babysit Mentor System](./babysit-mentor-system.md)
- [Hooks System](./hooks-system.md)
- [Agent Expert System](./agent-expert-system.md) - Auto self-improvement

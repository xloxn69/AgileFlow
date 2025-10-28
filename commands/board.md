---
description: board
allowed-tools: Bash, Read, Edit, Write, Glob, Grep
---

# board

Generate a visual kanban board from current story statuses.

## Prompt

ROLE: Board Visualizer

OBJECTIVE
Create a visual kanban board showing stories organized by status with color coding, WIP limits, and quick stats.

INPUTS (optional)
- EPIC=<EP_ID> (filter by specific epic)
- OWNER=<agent_id> (filter by owner)
- FORMAT=ascii|markdown|html (default: ascii)
- GROUP_BY=status|owner|epic (default: status)

DATA SOURCE
Read docs/09-agents/status.json to get all current story statuses.

BOARD LAYOUT (ASCII Format)

```
╔══════════════════════════════════════════════════════════════════════════════╗
║                           AGILEFLOW KANBAN BOARD                              ║
║                          Updated: 2025-10-17 14:30                            ║
╠══════════════════════════════════════════════════════════════════════════════╣
║ 📊 Summary: 15 stories | 3 ready | 4 in-progress | 2 in-review | 6 done     ║
║ ⚠️  WIP Limit: 2/agent (AG-UI: 2/2 ⚠️, AG-API: 1/2 ✓, AG-CI: 0/2 ✓)         ║
╚══════════════════════════════════════════════════════════════════════════════╝

┌─────────────────┬─────────────────┬─────────────────┬─────────────────┐
│ 📋 READY (3)    │ 🔄 IN PROGRESS  │ 👀 IN REVIEW    │ ✅ DONE (6)     │
│ WIP: -          │ (4) WIP: 4/6    │ (2) WIP: -      │ WIP: -          │
├─────────────────┼─────────────────┼─────────────────┼─────────────────┤
│                 │                 │                 │                 │
│ 🟢 US-0042      │ 🟡 US-0038      │ 🔵 US-0035      │ ⚪ US-0030      │
│ Login form UI   │ OAuth flow      │ Password reset  │ User registration│
│ AG-UI · 1d      │ AG-API · 1.5d   │ AG-API · 1d     │ AG-API · 1d     │
│ EP-0010         │ EP-0010         │ EP-0010         │ EP-0010         │
│                 │                 │                 │                 │
│ 🟢 US-0043      │ 🟡 US-0039      │ 🔵 US-0036      │ ⚪ US-0031      │
│ Profile page    │ Session mgmt    │ Email verify    │ Login endpoint  │
│ AG-UI · 1.5d    │ AG-API · 1d     │ AG-CI · 0.5d    │ AG-API · 1d     │
│ EP-0011         │ EP-0010         │ EP-0010         │ EP-0010         │
│                 │                 │                 │                 │
│ 🟢 US-0044      │ 🟡 US-0040      │                 │ ⚪ US-0032      │
│ Dashboard       │ Rate limiting   │                 │ JWT generation  │
│ AG-UI · 2d      │ AG-CI · 0.5d    │                 │ AG-API · 0.5d   │
│ EP-0011         │ EP-0010         │                 │ EP-0010         │
│                 │                 │                 │                 │
│                 │ 🟡 US-0041 ⚠️   │                 │ ⚪ US-0033      │
│                 │ BLOCKED         │                 │ DB schema       │
│                 │ Payment API     │                 │ AG-API · 0.5d   │
│                 │ AG-API · 2d     │                 │ EP-0010         │
│                 │ Dep: US-0035    │                 │                 │
│                 │                 │                 │ ⚪ US-0034      │
│                 │                 │                 │ Token refresh   │
│                 │                 │                 │ AG-API · 1d     │
│                 │                 │                 │ EP-0010         │
│                 │                 │                 │                 │
│                 │                 │                 │ ⚪ US-0037      │
│                 │                 │                 │ CI setup        │
│                 │                 │                 │ AG-CI · 1d      │
│                 │                 │                 │ EP-0010         │
└─────────────────┴─────────────────┴─────────────────┴─────────────────┘

Legend:
  🟢 Priority: High    🟡 Priority: Medium    🔵 Priority: Low    ⚪ Completed
  ⚠️  Blocked/WIP limit exceeded
```

COLOR CODING

Use emoji/symbols for visual distinction:
- 🟢 Green: High priority or ready to start
- 🟡 Yellow: In progress or medium priority
- 🔵 Blue: In review or low priority
- ⚪ White: Done
- 🔴 Red: Blocked
- ⚠️  Warning: WIP limit exceeded or blockers

MARKDOWN TABLE FORMAT

```markdown
## AgileFlow Board (2025-10-17 14:30)

**Summary**: 15 stories | 3 ready | 4 in-progress | 2 in-review | 6 done

| Ready | In Progress | In Review | Done |
|-------|-------------|-----------|------|
| **US-0042** 🟢<br>Login form UI<br>AG-UI · 1d<br>EP-0010 | **US-0038** 🟡<br>OAuth flow<br>AG-API · 1.5d<br>EP-0010 | **US-0035** 🔵<br>Password reset<br>AG-API · 1d<br>EP-0010 | **US-0030** ✅<br>User registration<br>AG-API · 1d<br>EP-0010 |
| **US-0043** 🟢<br>Profile page<br>AG-UI · 1.5d<br>EP-0011 | **US-0039** 🟡<br>Session mgmt<br>AG-API · 1d<br>EP-0010 | **US-0036** 🔵<br>Email verify<br>AG-CI · 0.5d<br>EP-0010 | **US-0031** ✅<br>Login endpoint<br>AG-API · 1d<br>EP-0010 |
| ... | ... | | ... |

### WIP Limits
- AG-UI: 2/2 ⚠️ (at limit)
- AG-API: 1/2 ✓
- AG-CI: 0/2 ✓

### Blockers
- US-0041 blocked by US-0035 (in review)
```

HTML FORMAT (for export)

```html
<!DOCTYPE html>
<html>
<head>
  <style>
    .board { display: flex; gap: 20px; padding: 20px; }
    .column { flex: 1; background: #f5f5f5; border-radius: 8px; padding: 15px; }
    .card { background: white; padding: 12px; margin: 10px 0; border-radius: 4px; box-shadow: 0 2px 4px rgba(0,0,0,0.1); }
    .ready { border-left: 4px solid #4caf50; }
    .in-progress { border-left: 4px solid #ff9800; }
    .in-review { border-left: 4px solid #2196f3; }
    .done { border-left: 4px solid #9e9e9e; }
    .blocked { border: 2px solid #f44336; }
  </style>
</head>
<body>
  <h1>AgileFlow Kanban Board</h1>
  <div class="board">
    <div class="column">
      <h2>📋 Ready (3)</h2>
      <div class="card ready">
        <strong>US-0042</strong><br>
        Login form UI<br>
        <small>AG-UI · 1d · EP-0010</small>
      </div>
      <!-- More cards -->
    </div>
    <!-- More columns -->
  </div>
</body>
</html>
```

GROUP BY OWNER

```
╔══════════════════════════════════════════════════════════════════════════════╗
║                      AGILEFLOW BOARD (Grouped by Owner)                       ║
╚══════════════════════════════════════════════════════════════════════════════╝

┌─────────────────┬─────────────────┬─────────────────┐
│ 🎨 AG-UI (5)    │ 🔧 AG-API (8)   │ ⚙️  AG-CI (2)    │
│ WIP: 2/2 ⚠️     │ WIP: 1/2 ✓      │ WIP: 0/2 ✓      │
├─────────────────┼─────────────────┼─────────────────┤
│                 │                 │                 │
│ 🟡 US-0038      │ 🟡 US-0039      │ ✅ US-0037      │
│ IN PROGRESS     │ IN PROGRESS     │ DONE            │
│ Login form      │ Session mgmt    │ CI setup        │
│                 │                 │                 │
│ 🟡 US-0040      │ 🔵 US-0035      │ 🔵 US-0036      │
│ IN PROGRESS     │ IN REVIEW       │ IN REVIEW       │
│ Profile page    │ Password reset  │ Email verify    │
│                 │                 │                 │
│ 🟢 US-0042      │ 🟢 US-0043      │                 │
│ READY           │ READY           │                 │
│ Dashboard       │ Payment API     │                 │
└─────────────────┴─────────────────┴─────────────────┘
```

STATISTICS

Include helpful stats:
```
📊 Board Statistics

Throughput:
  - Stories completed this week: 6
  - Avg completion time: 2.3 days
  - Velocity: 8.5 points/week

Status Distribution:
  - Ready: 3 (20%)
  - In Progress: 4 (27%)
  - In Review: 2 (13%)
  - Done: 6 (40%)

By Owner:
  - AG-UI: 5 stories (2 in progress)
  - AG-API: 8 stories (1 in progress)
  - AG-CI: 2 stories (0 in progress)

Blockers:
  - 1 story blocked (US-0041 waiting on US-0035)

Warnings:
  - AG-UI at WIP limit (2/2)
  - US-0050 stale (no updates in 7 days)
```

ACTIONS (after showing board)

1. Ask: "Would you like to:"
   - Export to file? (board-YYYYMMDD.md or .html)
   - Update a story status?
   - View details for a specific story?
   - Filter by epic/owner?

2. Suggest actions based on board state:
   - "AG-UI is at WIP limit. Consider completing US-0038 before starting new work."
   - "US-0041 is blocked. Can we unblock it by reviewing US-0035?"
   - "3 stories ready. Which should we prioritize?"

INTEGRATION

- Save board snapshot to docs/08-project/boards/board-<YYYYMMDD>.md
- Track board states over time for velocity analysis
- Optionally update /AgileFlow:velocity with latest data

WORKFLOW

1. Read docs/09-agents/status.json
2. Parse stories by status
3. Apply filters (epic, owner) if specified
4. Calculate WIP limits and warnings
5. Render board in requested format
6. Show statistics
7. Suggest actions

RULES
- Never modify status.json (read-only visualization)
- Highlight blockers and WIP violations prominently
- Keep ASCII board width ≤80 chars for terminal viewing
- Update timestamp on every render
- Sort stories by priority within columns

OUTPUT
- Rendered kanban board (ASCII/markdown/HTML)
- Statistics summary
- Action suggestions
- Optional: saved snapshot file

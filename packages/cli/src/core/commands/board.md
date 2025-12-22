---
description: Display visual kanban board with WIP limits
model: haiku
---

# board

Generate a visual kanban board from current story statuses.

## STEP 0: Activate Command

```bash
node -e "
const fs = require('fs');
const path = 'docs/09-agents/session-state.json';
if (fs.existsSync(path)) {
  const state = JSON.parse(fs.readFileSync(path, 'utf8'));
  const cmd = { name: 'board', activated_at: new Date().toISOString(), state: {} };
  state.active_commands = state.active_commands || [];
  if (!state.active_commands.some(c => c.name === cmd.name)) state.active_commands.push(cmd);
  fs.writeFileSync(path, JSON.stringify(state, null, 2) + '\n');
  console.log('✅ board command activated');
}
"
```

<!-- COMPACT_SUMMARY_START -->
## Compact Summary

**Command**: `board`
**Purpose**: Generate visual kanban board from current story statuses

**Quick Usage**:
```
/agileflow:board
/agileflow:board EPIC=EP-0010
/agileflow:board OWNER=AG-UI FORMAT=markdown
/agileflow:board GROUP_BY=owner
```

**What It Does**:
1. Reads `docs/09-agents/status.json` for story data
2. Organizes stories by status (or owner/epic if specified)
3. Calculates WIP limits and identifies violations
4. Renders visual board with color coding
5. Shows statistics (throughput, velocity, blockers)
6. Suggests actions based on board state

**Input Options**:
- `EPIC=<EP_ID>` - Filter by specific epic
- `OWNER=<agent_id>` - Filter by owner
- `FORMAT=ascii|markdown|html` - Output format (default: ascii)
- `GROUP_BY=status|owner|epic` - Grouping method (default: status)

**Board Layout** (ASCII):
```
╔══════════════════════════════════════════════════════════════╗
║                   AGILEFLOW KANBAN BOARD                      ║
║                  Updated: 2025-12-22 14:30                    ║
╠══════════════════════════════════════════════════════════════╣
║ 📊 Summary: 15 stories | 3 ready | 4 in-progress | 6 done   ║
║ ⚠️  WIP Limit: 2/agent (AG-UI: 2/2 ⚠️, AG-API: 1/2 ✓)       ║
╚══════════════════════════════════════════════════════════════╝

┌──────────────┬──────────────┬──────────────┬──────────────┐
│ 📋 READY (3) │ 🔄 IN PROG   │ 👀 REVIEW    │ ✅ DONE (6)  │
│              │ (4) WIP: 4/6 │ (2)          │              │
├──────────────┼──────────────┼──────────────┼──────────────┤
│ 🟢 US-0042   │ 🟡 US-0038   │ 🔵 US-0035   │ ⚪ US-0030   │
│ Login form   │ OAuth flow   │ Pwd reset    │ User reg     │
│ AG-UI · 1d   │ AG-API · 1.5d│ AG-API · 1d  │ AG-API · 1d  │
└──────────────┴──────────────┴──────────────┴──────────────┘
```

**Color Coding**:
- 🟢 Green: High priority / ready to start
- 🟡 Yellow: In progress / medium priority
- 🔵 Blue: In review / low priority
- ⚪ White: Done
- 🔴 Red: Blocked
- ⚠️ Warning: WIP limit exceeded

**Statistics Provided**:
- Throughput (stories completed per week)
- Velocity (points per week)
- Status distribution
- Owner workload
- Blockers and warnings

**Action Suggestions**:
- "AG-UI at WIP limit. Complete US-0038 before starting new work."
- "US-0041 blocked. Unblock by reviewing US-0035?"
- "3 stories ready. Which should we prioritize?"

**Best Practices**:
- Review board daily to identify bottlenecks
- Keep WIP limits respected (default: 2/agent)
- Export board snapshots to track velocity over time
- Use GROUP_BY=owner to balance workload

<!-- COMPACT_SUMMARY_END -->

## Prompt

ROLE: Board Visualizer

OBJECTIVE
Create a visual kanban board showing stories organized by status with color coding, WIP limits, and quick stats.

CONTEXT

Live repository state:
- Current branch: !`git branch --show-current`
- Last commit: !`git log -1 --oneline`
- Recent activity: !`git log --since="7 days ago" --oneline | head -5`
- Status file modified: !`stat -c %y docs/09-agents/status.json 2>/dev/null || echo "Not found"`

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
- Optionally update /agileflow:velocity with latest data

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

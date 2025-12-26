---
description: View past session history and metrics
argument-hint: "[DAYS=7|30|90|all]"
---

# /agileflow:session:history

View historical session data and metrics.

---

## Purpose

Show all sessions (active and inactive) with creation dates, last activity, and work done.

## Arguments

| Argument | Default | Description |
|----------|---------|-------------|
| DAYS | 30 | Filter sessions by age (7, 30, 90, or "all") |

## IMMEDIATE ACTIONS

### Step 1: Get All Sessions

```bash
node .agileflow/scripts/session-manager.js list --json
```

### Step 2: Filter by Timeframe

Parse the DAYS argument and filter sessions by their `created` timestamp.

### Step 3: Display History

```
📜 Session History (Last 30 days)

┌─────┬────────────┬──────────────────┬─────────────┬────────────┐
│  #  │ Created    │ Name/Branch      │ Story       │ Status     │
├─────┼────────────┼──────────────────┼─────────────┼────────────┤
│  1  │ Dec 20     │ main             │ -           │ ● Active   │
│  2  │ Dec 22     │ "auth"           │ US-0042     │ ● Active   │
│  3  │ Dec 23     │ feature/payments │ US-0051     │ ○ Inactive │
│  4  │ Dec 25     │ "bugfix"         │ US-0038     │ ○ Inactive │
└─────┴────────────┴──────────────────┴─────────────┴────────────┘

Summary: 4 sessions │ 2 active │ 2 inactive
```

### Step 4: Show Tips

```
💡 Tips:
   • /agileflow:session:new to create a new session
   • /agileflow:session:delete {id} to remove old sessions
   • Inactive sessions can be resumed with /agileflow:session:resume
```

## No History Case

```
📜 Session History

No sessions found in the last {DAYS} days.

Try /agileflow:session:history DAYS=all to see all sessions.
```

## Related Commands

- `/agileflow:session:status` - Current status
- `/agileflow:session:resume` - Switch sessions

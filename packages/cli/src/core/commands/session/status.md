---
description: View current session state and activity
argument-hint: (no arguments)
---

# /agileflow:session:status

Quick view of all sessions and their status.

---

## Purpose

Display a compact overview of all registered sessions without prompting for action.

## IMMEDIATE ACTIONS

### Step 1: Get Session Data

```bash
node .agileflow/scripts/session-manager.js list --json
```

### Step 2: Display Formatted Table

```
📊 Session Status

Current: Session 1 (main)
         Branch: main │ Story: US-0042 │ Active

Other Sessions:
┌─────┬──────────────────┬─────────────┬────────────┐
│  #  │ Name/Branch      │ Story       │ Status     │
├─────┼──────────────────┼─────────────┼────────────┤
│  2  │ "auth"           │ US-0038     │ ● Active   │
│  3  │ feature/payments │ -           │ ○ Inactive │
└─────┴──────────────────┴─────────────┴────────────┘

Total: 3 sessions │ 2 active
```

### Step 3: Show Quick Actions

```
💡 Quick actions:
   /agileflow:session:new    - Create parallel session
   /agileflow:session:resume - Switch to another session
   /agileflow:session:end    - End current session
```

## No Sessions Case

```
📊 Session Status

No sessions registered yet. You're in the main project directory.
Run /agileflow:session:new to create a parallel workspace.
```

## Related Commands

- `/agileflow:session:new` - Create new session
- `/agileflow:session:resume` - Switch sessions
- `/agileflow:session:end` - End current session

---
description: Initialize session harness with test verification
argument-hint: (no arguments)
---

# /agileflow:session:init

Initialize or verify the session management system.

---

## Purpose

Sets up session tracking infrastructure:
- Creates `.agileflow/sessions/` directory
- Initializes `registry.json` if missing
- Registers the current session
- Displays session status

This command is typically called automatically by the SessionStart hook.

## IMMEDIATE ACTIONS

### Step 1: Ensure Session Infrastructure

```bash
node .agileflow/scripts/session-manager.js register
```

This will:
- Create `.agileflow/sessions/` if missing
- Create `registry.json` with schema if missing
- Register current directory as a session
- Create lock file with current PID

### Step 2: Check for Other Active Sessions

```bash
node .agileflow/scripts/session-manager.js count
```

If `count > 0`, there are other active sessions.

### Step 3: Display Status

**If no other sessions:**
```
✓ Session initialized

  Session ID: 1
  Path: /home/user/project
  Branch: main

No other active sessions detected.
```

**If other sessions active:**
```
✓ Session initialized

  Session ID: 1 (current)
  Path: /home/user/project
  Branch: main

⚠️ {count} other session(s) active in this repo.
   Run /agileflow:session:status to see all sessions.
   Run /agileflow:session:new to create isolated workspace.
```

## Already Initialized Case

If session is already registered:
```
✓ Session already active

  Session ID: 1
  Path: /home/user/project
  Branch: main
```

## Related Commands

- `/agileflow:session:status` - View all sessions
- `/agileflow:session:new` - Create parallel session

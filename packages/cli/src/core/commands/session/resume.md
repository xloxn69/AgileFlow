---
description: Pick a session to switch to or resume
argument-hint: (no arguments)
---

# /agileflow:session:resume

View all sessions and get the command to switch to one.

---

## Purpose

When you have multiple sessions and want to switch between them, this command:
- Lists all registered sessions (active and inactive)
- Shows which are currently active (have a running Claude process)
- Provides the `cd` command to switch to your chosen session

## IMMEDIATE ACTIONS

Upon invocation, execute these steps:

### Step 1: Get All Sessions

```bash
node .agileflow/scripts/session-manager.js list --json
```

Parse the JSON output to get session data.

### Step 2: Build AskUserQuestion Options

For each session, create an option:

```
AskUserQuestion:
  question: "Which session would you like to resume?"
  header: "Sessions"
  multiSelect: false
  options:
    - label: "Session 1: main (current)"
      description: "US-0042: User Auth API │ Active now │ /home/user/project"
    - label: "Session 2: \"auth\""
      description: "US-0038: Fix Login │ Active now │ ../project-auth"
    - label: "Create new session"
      description: "Start a fresh parallel workspace"
```

**Formatting rules:**
- Show nickname in quotes if present, otherwise show branch
- Mark active sessions with "Active now"
- Mark inactive sessions with time since last active
- Mark current session with "(current)"
- Include story ID if available
- Show relative path for non-main sessions

### Step 3: Handle User Selection

**If user selects a different session:**

Display the command to switch:

```
To resume Session 2 "auth":

┌─────────────────────────────────────────────────────────┐
│   cd ../project-auth && claude --resume                 │
└─────────────────────────────────────────────────────────┘

Session info:
  Branch: session-2
  Story:  US-0038 (in-progress)
```

**If user selects current session:**

```
You're already in Session 1!
```

**If user selects "Create new session":**

```
Run /agileflow:session:new to create a new parallel workspace.
```

## Related Commands

- `/agileflow:session:new` - Create new session
- `/agileflow:session:status` - Quick status view
- `/agileflow:session:end` - End current session

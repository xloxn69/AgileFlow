---
description: Create a new parallel session with git worktree
argument-hint: (no arguments)
---

# /agileflow:session:new

Create a new isolated session for parallel Claude Code work.

---

## Purpose

When you need to work on multiple things simultaneously in the same repo, this command creates a new session with:
- A separate git worktree (isolated directory)
- Its own branch
- Independent session tracking

## IMMEDIATE ACTIONS

Upon invocation, execute these steps:

### Step 1: Check Prerequisites

```bash
# Verify git is available and we're in a git repo
git rev-parse --is-inside-work-tree
```

If not in a git repo, display error and exit.

### Step 2: Run Session Manager to Get Current State

```bash
node .agileflow/scripts/session-manager.js status
```

Parse the JSON output to understand current sessions.

### Step 3: Present Options with AskUserQuestion

Use AskUserQuestion to let user choose how to create the session:

```
AskUserQuestion:
  question: "How would you like to create your new session?"
  header: "New session"
  multiSelect: false
  options:
    - label: "Auto-create Session {next_id} (Recommended)"
      description: "Creates ../project-{next_id} with new branch session-{next_id}"
    - label: "Name this session"
      description: "Give it a memorable name like 'auth' or 'bugfix'"
    - label: "Use existing branch"
      description: "Create session from one of your existing branches"
```

### Step 4a: If "Auto-create" Selected

```bash
node .agileflow/scripts/session-manager.js create
```

Parse the JSON result. Display:

```
✓ Created Session {id}

  Workspace: {path}
  Branch:    {branch}

┌─────────────────────────────────────────────────────────┐
│ To start working in this session, run:                  │
│                                                         │
│   {command}                                             │
│                                                         │
└─────────────────────────────────────────────────────────┘
```

### Step 4b: If "Name this session" Selected

Use AskUserQuestion to get the name:

```
AskUserQuestion:
  question: "What should this session be called?"
  header: "Session name"
  multiSelect: false
  options:
    - label: "auth"
      description: "Working on authentication"
    - label: "bugfix"
      description: "Fixing bugs"
    - label: "feature"
      description: "New feature work"
    - label: "experiment"
      description: "Trying something out"
```

Then create with nickname:

```bash
node .agileflow/scripts/session-manager.js create --nickname {name}
```

### Step 4c: If "Use existing branch" Selected

List branches:

```bash
git branch --format='%(refname:short)'
```

Use AskUserQuestion to present branch options (limit to 4-5 most recent).

Then create with specified branch:

```bash
node .agileflow/scripts/session-manager.js create --branch {branch_name}
```

### Step 5: Display Success Message

Show the created session details and the command to start working:

```
✓ Created Session {id} "{nickname}"

  Workspace: ../project-{name}
  Branch:    session-{id}-{name}

┌─────────────────────────────────────────────────────────┐
│ To start working in this session, run:                  │
│                                                         │
│   cd ../project-{name} && claude                        │
│                                                         │
└─────────────────────────────────────────────────────────┘

💡 Tip: Use /agileflow:session:resume to see all sessions
```

## Error Handling

- **Directory exists**: Suggest different name or manual cleanup
- **Branch conflict**: Offer to use existing branch or create new one
- **Git errors**: Display error message and suggest manual resolution

## Related Commands

- `/agileflow:session:resume` - Switch between sessions
- `/agileflow:session:status` - View all sessions
- `/agileflow:session:end` - End current session

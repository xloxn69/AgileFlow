---
description: Cleanly end session and record summary
argument-hint: (no arguments)
---

# /agileflow:session:end

End the current session and optionally clean up the worktree.

---

## Purpose

When you're done with a session, this command:
- Removes the session's lock file (marks it inactive)
- Optionally removes the git worktree directory
- Updates the registry with last active timestamp

## IMMEDIATE ACTIONS

### Step 1: Get Current Session

```bash
node .agileflow/scripts/session-manager.js status
```

If no current session is registered, display message and exit.

### Step 2: Present Options with AskUserQuestion

```
AskUserQuestion:
  question: "End Session {id}?"
  header: "End session"
  multiSelect: false
  options:
    - label: "Yes, end session"
      description: "Mark session inactive (keep worktree for later)"
    - label: "End and delete worktree"
      description: "Remove session and its directory completely"
    - label: "Cancel"
      description: "Keep session active"
```

Note: Don't show "delete worktree" option for main session (is_main: true).

### Step 3a: If "End session" Selected

```bash
node .agileflow/scripts/session-manager.js unregister {session_id}
```

Display:
```
✓ Session {id} ended

  Branch: {branch}
  Story:  {story_id} (status unchanged)
  Worktree kept at: {path}

To resume later: cd {path} && claude
```

### Step 3b: If "End and delete worktree" Selected

```bash
node .agileflow/scripts/session-manager.js delete {session_id} --remove-worktree
```

Display:
```
✓ Session {id} ended and removed

  Branch: {branch}
  Worktree removed: {path}

💡 The branch still exists. To delete it:
   git branch -d {branch}
```

### Step 3c: If "Cancel" Selected

```
Session remains active.
```

## Main Session Warning

If current session is the main project (is_main: true):

```
⚠️ This is the main project session.

You can only end this session (mark inactive), not delete the directory.
The main project is not a worktree and cannot be removed.
```

## Related Commands

- `/agileflow:session:new` - Create new session
- `/agileflow:session:resume` - Switch sessions
- `/agileflow:session:status` - View all sessions

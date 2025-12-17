---
description: View current session state and activity
argument-hint: (no arguments)
---

# Session Status

You are running the `/agileflow:session:status` command to view a quick snapshot of the current session state, including what you're working on, session duration, uncommitted changes, and test status.

## Command Purpose

Quick view of current session activity without running tests or loading full context. Use this when you want to see:
- What story you're currently working on
- How long this session has been running
- Whether you have uncommitted changes
- Recent activity in this session

## Execution Flow

### 1. Load Session State

Read from `docs/09-agents/session-state.json`:

```bash
if [ ! -f "docs/09-agents/session-state.json" ]; then
  echo "⚠️  No active session"
  echo ""
  echo "Run /agileflow:session:resume to start a session"
  exit 0
fi
```

### 2. Calculate Session Duration

```bash
STARTED_AT=$(jq -r '.current_session.started_at' docs/09-agents/session-state.json)
NOW=$(date -u +%Y-%m-%dT%H:%M:%SZ)

# Calculate duration
DURATION=$(calculate_duration "$STARTED_AT" "$NOW")
```

### 3. Get Current Work

Read from `docs/09-agents/status.json`:
- Current in-progress story
- Story owner/assignee
- Story progress/status

### 4. Check Git Status

```bash
# Uncommitted changes
UNCOMMITTED=$(git status --short | wc -l)

# Commits this session
SESSION_START_COMMIT=$(jq -r '.current_session.baseline_commit // "HEAD~10"' docs/09-agents/session-state.json)
COMMITS_THIS_SESSION=$(git rev-list --count $SESSION_START_COMMIT..HEAD 2>/dev/null || echo "0")
```

### 5. Get Test Status

Read last test status from session-state.json (without re-running tests):
- Last test result
- Time since last test run
- Pass/fail count

### 6. Display Summary

```
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
📊 Current Session
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Session ID: sess-20251216-140000
Started: 2 hours 15 minutes ago
Duration: 2h 15m

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
🎯 Current Work
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Story: US-0043
Title: Add user profile settings page
Status: in_progress
Owner: ui
Epic: EP-0001 (User Management)

Progress:
  ✅ 3/5 acceptance criteria met
  📝 2 remaining

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
📁 Git Activity
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Branch: feature/user-profile
Commits this session: 3
Uncommitted changes: 2 files

Modified:
  M src/components/ProfileForm.tsx
  M src/api/user.ts

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
🧪 Test Status
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Last run: 45 minutes ago
Result: ✅ Passing (42/42)
Command: npm test

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
⚡ Quick Actions
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

• Run tests: /agileflow:verify
• End session: /agileflow:session:end
• View full context: /agileflow:session:resume
• View story: docs/06-stories/EP-0001/US-0043.md

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
```

## Compact Mode

For a shorter output, show minimal info:

```
📊 Session: 2h 15m | 🎯 US-0043 (in_progress) | 📁 3 commits, 2 uncommitted | 🧪 ✅ 42/42
```

## Output Variations

### No Active Session
```
⚠️  No Active Session

No session is currently tracked.

To start a session:
  /agileflow:session:resume

This will:
  • Run environment initialization
  • Verify tests
  • Load context
  • Start session tracking
```

### Session With No Current Story
```
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
📊 Current Session
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Session ID: sess-20251216-140000
Started: 30 minutes ago
Duration: 30m

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
🎯 Current Work
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

No story currently assigned.

Ready stories (5):
  • US-0044: Implement password reset flow
  • US-0045: Add email verification
  • US-0046: Create admin dashboard
  • US-0047: Add user roles
  • US-0048: Implement audit logging

Assign a story: /agileflow:assign STORY=US-0044

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
```

### Session With Failing Tests
```
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
📊 Current Session
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Session ID: sess-20251216-140000
Started: 1 hour ago

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
🧪 Test Status ⚠️
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Last run: 10 minutes ago
Result: ❌ FAILING (40/42)

Failed tests:
  ❌ auth.test.ts:42 - Session redirect
  ❌ auth.test.ts:67 - Token persistence

Run /agileflow:verify to see full output

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
```

### Long Session Warning
```
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
📊 Current Session
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Session ID: sess-20251216-080000
Started: 8 hours ago
Duration: 8h 15m

⚠️  Long session detected!
Consider:
  • Taking a break
  • Committing your work
  • Running /agileflow:session:end to save progress

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
```

## Related Commands

| Command | Purpose |
|---------|---------|
| `/agileflow:session:init` | One-time setup of session harness |
| `/agileflow:session:resume` | Start session with full verification |
| `/agileflow:session:end` | Cleanly end session and record summary |
| `/agileflow:session:history` | View past session history and metrics |

## Integration Points

### Reads
- `docs/09-agents/session-state.json` - Current session info
- `docs/09-agents/status.json` - Story status
- Git status - Uncommitted changes

### Does NOT
- Run tests (use `/agileflow:verify` for that)
- Modify any files
- Start a new session

## Implementation Notes

1. **Fast**: No tests, no heavy operations - instant response
2. **Read-Only**: Never modifies files
3. **Non-Blocking**: No user input required
4. **Informative**: Shows actionable next steps
5. **Context-Aware**: Adapts output based on current state

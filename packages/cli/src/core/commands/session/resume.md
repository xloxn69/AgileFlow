---
description: Resume work with verification and context loading
argument-hint: (no arguments)
---

# Resume AgileFlow Session

You are running the `/agileflow:session:resume` command to start an AgileFlow session with environment verification, test checking, and context loading.

## IMMEDIATE ACTIONS

**Execute these steps NOW in order:**

### Step 1: Read session-state.json
```bash
cat docs/09-agents/session-state.json
```

### Step 2: Read status.json for current stories
```bash
cat docs/09-agents/status.json
```

### Step 3: Get git context
```bash
git branch --show-current && git log --oneline -5 && git status --short
```

### Step 4: Update session-state.json with new session
Use the Write tool to update `docs/09-agents/session-state.json`:
- Set `current_session.id` to `sess-YYYYMMDD-HHMMSS` (current timestamp)
- Set `current_session.started_at` to current ISO timestamp
- Set `current_session.branch` to current git branch
- Set `current_session.head_sha_start` to current HEAD
- Keep `last_session` as-is (from previous read)

### Step 5: Display session summary
Output a formatted summary showing:
- Last session info (if exists)
- Current work (in-progress stories from status.json)
- Ready queue (ready stories from status.json)
- Git status (branch, recent commits)
- Next steps

## TODO LIST TRACKING

**CRITICAL**: Immediately create a todo list using TodoWrite tool to track session resumption:
```
1. Read session-state.json
2. Read status.json
3. Get git context (branch, commits, status)
4. Update session-state.json with new session
5. Display session summary
```

Mark each step complete as you finish it. This ensures comprehensive session startup.

**When to use:**
- Manually: Start of each coding session
- Automatically: Via SessionStart hook (configured in `/agileflow:session:init`)

## Prerequisites

- Session harness must be initialized (`/agileflow:session:init`)
- Must be in project root directory

## Execution Flow

### 1. Check Initialization

```bash
if [ ! -f "docs/00-meta/environment.json" ]; then
  echo "⚠️  Session harness not initialized"
  echo ""
  echo "Run /agileflow:session:init to set up test verification"
  echo ""
  echo "Or continue without session harness? [y/N]: "

  # If user says no, exit
  # If yes, skip to step 4 (load context only)
fi
```

### 2. Run Init Script (Optional)

If `init_script` is configured in environment.json:

```bash
INIT_SCRIPT=$(jq -r '.init_script' docs/00-meta/environment.json)

if [ -f "$INIT_SCRIPT" ]; then
  echo "🚀 Running environment initialization..."
  echo ""

  bash "$INIT_SCRIPT"

  if [ $? -eq 0 ]; then
    echo ""
    echo "✅ Environment ready"
  else
    echo ""
    echo "⚠️  Init script encountered issues"
    echo "Continue anyway? [Y/n]: "
  fi
fi
```

**Output example:**
```
🚀 Running environment initialization...

📦 Installing dependencies (npm ci)...
✅ Dependencies installed

✅ Environment ready
```

### 3. Verify Tests

Run `/agileflow:verify` to check current test status:

```
🧪 Running tests...
Command: npm test
```

**Track changes from last session:**
- Read `last_session.final_test_status` from session-state.json
- Compare to current test results
- Detect regressions

**If tests were passing, now failing:**
```
⚠️  REGRESSION DETECTED

Tests were: passing (last session)
Tests are now: FAILING

Failed: 2/42 tests
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

❌ auth.test.ts:42
   Expected redirect to /dashboard
   Got redirect to /login

❌ auth.test.ts:67
   Session token not persisting

Recent commits:
  abc123 - feat: update auth flow (2 hours ago)
  def456 - fix: session cookie domain (3 hours ago)

Likely culprit: abc123 (auth flow changes)
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
```

**If tests passing:**
```
✅ All tests passing (42/42)
Duration: 12.3s
```

### 4. Load Git Context

Get recent activity:

```bash
# Last 5 commits
git log --oneline -5

# Current branch
git branch --show-current

# Working tree status
git status --short
```

### 5. Load AgileFlow Context

Read from status.json and session-state.json:

**Current Work:**
- Stories with status `in_progress`
- Stories with status `ready` (prioritized)
- Stories with status `blocked` (with blocker info)

**Recent Activity:**
- Stories completed since last session
- Commits made since last session
- Test status changes

**Previous Story Insights:**
- If current story has Previous Story Insights, load them
- If current story has Dev Agent Record from previous stories in epic, highlight key lessons

### 6. Update Session State

Update `docs/09-agents/session-state.json`:

```json
{
  "current_session": {
    "id": "sess-20251206-140000",
    "started_at": "2025-12-06T14:00:00Z",
    "baseline_verified": true,
    "initial_test_status": "passing",
    "current_story": "US-0043",
    "active_agent": null
  },
  "last_session": {
    "id": "sess-20251205-140000",
    "ended_at": "2025-12-05T18:00:00Z",
    "stories_completed": ["US-0041", "US-0042"],
    "final_test_status": "passing",
    "commits": ["abc123", "def456"]
  },
  "session_history": [
    {
      "date": "2025-12-05",
      "sessions": 2,
      "stories_completed": 3,
      "test_regressions": 0
    }
  ]
}
```

### 7. Generate Session Summary

Compile and display comprehensive summary:

```
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
🚀 AgileFlow Session Resumed
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

📅 Last Session: 1 day ago (sess-20251205-140000)
   Duration: 4 hours
   Stories Completed: US-0041, US-0042

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
📊 Current State
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

→ In Progress (1):
  US-0043: Add user profile settings page
  Owner: ui
  Started: 2 hours ago
  Tests: ✅ passing

Ready Queue (5):
  US-0044: Implement password reset flow
  US-0045: Add email verification
  US-0046: Create admin dashboard
  US-0047: Add user roles and permissions
  US-0048: Implement audit logging

Blocked (1):
  US-0049: Deploy to production
  Blocker: Waiting on US-0043 completion
  Owner: devops

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
🧪 Test Status
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

✅ All Passing (42/42)
Last Run: Just now
Command: npm test
Duration: 12.3s

No regressions detected since last session ✅

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
📁 Git Status
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Branch: feature/user-profile
Status: Clean working tree ✅

Recent commits:
  abc123 - feat: add profile form component (2 hours ago)
  def456 - test: add profile validation tests (3 hours ago)
  ghi789 - docs: update API documentation (1 day ago)

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
💡 Context from Previous Stories
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

From US-0042 (completed 1 day ago):
• Use shadcn/ui form components for consistency
• zod validation reduces runtime errors significantly
• Watch for Next.js hydration mismatches with dynamic content
• Form state management works well with react-hook-form

From US-0041 (completed 2 days ago):
• API rate limiting needs Redis configuration
• Test coverage requirement: 85% for new features
• Always run migration before testing DB changes

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Ready to work on US-0043: "Add user profile settings page" 🚀

Next steps:
  1. Review story details: docs/06-stories/EP-0001/US-0043.md
  2. Check Architecture Context for implementation guidance
  3. Review Previous Story Insights above
  4. Implement to acceptance criteria
  5. Run /agileflow:verify before marking complete

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
```

### 8. Minimal Mode (If No Session Harness)

If session harness not initialized, provide basic context:

```
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
🚀 AgileFlow Session (Basic Mode)
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

⚠️  Session harness not initialized
   Run /agileflow:session:init for:
   • Automatic test verification
   • Session state tracking
   • Baseline management
   • Regression detection

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
📊 Current State (from status.json)
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

In Progress (1):
  US-0043: Add user profile settings page
  Owner: ui

Ready Queue (5):
  US-0044, US-0045, US-0046, US-0047, US-0048

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
```

## Output Variations

### First Session Ever
```
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
🚀 Welcome to AgileFlow!
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

This is your first session with session harness enabled.

✅ Environment ready
✅ Tests passing (42/42)
✅ Baseline established

No stories in progress yet. Ready to start work!

Next steps:
  1. Review available stories: docs/06-stories/
  2. Assign yourself a story: /agileflow:assign
  3. Start implementation following AC
  4. Run /agileflow:verify before completion

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
```

### After Long Break (7+ days)
```
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
🚀 Welcome Back!
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Last session: 8 days ago

Since then:
  • 12 stories completed
  • 45 commits
  • 3 new epics added

Consider running /agileflow:session:status for full overview

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
```

## Related Commands

| Command | Purpose |
|---------|---------|
| `/agileflow:session:init` | One-time setup of session harness |
| `/agileflow:session:status` | View current session state and activity |
| `/agileflow:session:end` | Cleanly end session and record summary |
| `/agileflow:session:history` | View past session history and metrics |

## Error Handling

### Init Script Fails
```
⚠️  Environment initialization failed

Error: npm ci exited with code 1

Output:
  npm ERR! ENOLOCK: no package-lock.json found

Options:
  1. Fix issue and retry
  2. Continue without running init
  3. Exit and investigate

Choice [1/2/3]: _
```

### Tests Fail
```
❌ Tests Failed

Command: npm test
Exit Code: 1
Failed: 2/42 tests

Options:
  1. View failed test output
  2. Continue with failing tests (mark in session state)
  3. Exit to fix tests first

Choice [1/2/3]: _
```

### Git Issues
```
⚠️  Git status check failed

This might indicate:
  • Not in a git repository
  • Git not installed
  • Repository corruption

Continuing without git context...
```

### Status.json Corrupted
```
❌ Cannot read status.json

File appears corrupted or invalid JSON.

Backup exists at: docs/09-agents/status.json.backup

Options:
  1. Restore from backup
  2. Continue with empty status
  3. Exit and fix manually

Choice [1/2/3]: _
```

## Integration Points

### Called By
- SessionStart hook (if configured)
- User manually via `/agileflow:session:resume`

### Calls
- `/agileflow:verify` - Test verification
- Init script (`docs/00-meta/init.sh`)

### Reads
- `docs/00-meta/environment.json` - Configuration
- `docs/09-agents/session-state.json` - Session history
- `docs/09-agents/status.json` - Current story status
- Git log and status - Recent activity

### Updates
- `docs/09-agents/session-state.json` - Current session metadata

## Implementation Notes

1. **Fast Execution**: Optimize for quick startup (<5 seconds typical)
2. **Graceful Degradation**: Works even if parts fail
3. **Clear Output**: Visual hierarchy with clear sections
4. **Actionable**: Always end with clear next steps
5. **Context-Rich**: Provide all info needed to resume work
6. **Non-Blocking**: Don't wait for user input unless critical
7. **Silent Option**: Support quiet mode for hook usage

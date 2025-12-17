---
description: Cleanly end session and record summary
argument-hint: (no arguments)
---

# End Session

You are running the `/agileflow:session:end` command to cleanly close the current AgileFlow session. This records what was accomplished, updates session history, and prepares for the next session.

## Command Purpose

Proper session closure that:
- Records stories completed during the session
- Captures commits made
- Saves final test status
- Updates session history for analytics
- Provides a summary of accomplishments

## TODO LIST TRACKING

**CRITICAL**: Immediately create a todo list using TodoWrite tool:
```
1. Check for active session
2. Run final test verification (optional)
3. Capture session metrics (duration, commits, stories)
4. Update session-state.json (move current to last)
5. Append to session history
6. Display session summary
7. Suggest next actions
```

## When to Use

- End of work day
- Before stepping away for extended time
- After completing a major milestone
- Before switching to a different project

## Execution Flow

### 1. Check Active Session

```bash
if [ ! -f "docs/09-agents/session-state.json" ]; then
  echo "⚠️  No active session to end"
  echo ""
  echo "Run /agileflow:session:resume to start a session first"
  exit 0
fi

CURRENT_SESSION=$(jq -r '.current_session.id' docs/09-agents/session-state.json)

if [ "$CURRENT_SESSION" == "null" ]; then
  echo "⚠️  No active session"
  exit 0
fi
```

### 2. Gather Session Metrics

```bash
# Session timing
STARTED_AT=$(jq -r '.current_session.started_at' docs/09-agents/session-state.json)
ENDED_AT=$(date -u +%Y-%m-%dT%H:%M:%SZ)
DURATION=$(calculate_duration "$STARTED_AT" "$ENDED_AT")

# Git activity
BASELINE_COMMIT=$(jq -r '.current_session.baseline_commit // "HEAD~50"' docs/09-agents/session-state.json)
COMMITS=$(git rev-list --oneline $BASELINE_COMMIT..HEAD 2>/dev/null | head -20)
COMMIT_COUNT=$(echo "$COMMITS" | grep -c . || echo "0")

# Files changed
FILES_CHANGED=$(git diff --stat $BASELINE_COMMIT..HEAD 2>/dev/null | tail -1)
```

### 3. Identify Completed Stories

Check `docs/09-agents/status.json` for stories that changed to `completed` or `in-review` during this session:

```bash
# Compare to session start snapshot
# Identify stories that moved to completed/in-review
```

### 4. Run Final Test Check (Optional)

```
Run final test verification before ending session? [Y/n]: _
```

If yes:
```
🧪 Running final tests...
✅ All passing (42/42)

Final test status recorded.
```

### 5. Update Session State

Update `docs/09-agents/session-state.json`:

```json
{
  "current_session": null,
  "last_session": {
    "id": "sess-20251216-140000",
    "started_at": "2025-12-16T14:00:00Z",
    "ended_at": "2025-12-16T18:30:00Z",
    "duration_minutes": 270,
    "stories_completed": ["US-0043"],
    "stories_progressed": ["US-0044"],
    "final_test_status": "passing",
    "commits": ["abc123", "def456", "ghi789"],
    "files_changed": 12,
    "lines_added": 450,
    "lines_removed": 120
  },
  "session_history": [
    {
      "date": "2025-12-16",
      "sessions": 1,
      "total_duration_minutes": 270,
      "stories_completed": 1,
      "commits": 3,
      "test_regressions": 0
    },
    // ... previous days
  ]
}
```

### 6. Display Session Summary

```
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
✅ Session Ended
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Session: sess-20251216-140000
Duration: 4 hours 30 minutes
Date: December 16, 2025

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
📊 Accomplishments
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Stories Completed (1):
  ✅ US-0043: Add user profile settings page

Stories Progressed (1):
  🔄 US-0044: Implement password reset flow
     Progress: 2/4 acceptance criteria

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
📁 Code Changes
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Commits: 3
  abc123 - feat: add profile form component
  def456 - test: add profile validation tests
  ghi789 - fix: profile image upload

Files changed: 12
Lines: +450 / -120

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
🧪 Test Status
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Final: ✅ All Passing (42/42)
No regressions introduced ✅

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
📈 Session Stats
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

This session:
  • Duration: 4h 30m
  • Stories completed: 1
  • Commits: 3
  • Productivity: 0.22 stories/hour

Today (all sessions):
  • Total time: 4h 30m
  • Stories completed: 1
  • Sessions: 1

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
📋 For Next Session
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Continue with:
  🔄 US-0044: Implement password reset flow
     Remaining: Email template, Token validation

Ready to pick up:
  • US-0045: Add email verification
  • US-0046: Create admin dashboard

Run /agileflow:session:resume to start next session

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
```

## Output Variations

### Session With Uncommitted Changes
```
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
⚠️  Uncommitted Changes Detected
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

You have 3 uncommitted files:
  M src/components/ProfileForm.tsx
  M src/api/user.ts
  ? src/utils/validation.ts

Options:
  1. Commit changes now
  2. End session anyway (changes preserved)
  3. Cancel and continue working

Choice [1/2/3]: _
```

### Short Session Warning
```
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
📊 Session Summary
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Session Duration: 15 minutes

ℹ️  Short session - minimal changes recorded.

Commits: 0
Stories completed: 0

End this session? [y/N]: _
```

### Session With Failing Tests
```
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
⚠️  Tests Failing
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Current test status: ❌ FAILING (40/42)

Failed tests:
  ❌ auth.test.ts:42
  ❌ auth.test.ts:67

Ending session with failing tests will:
  • Record "failing" as final test status
  • Flag potential regression for next session

Options:
  1. Fix tests first (recommended)
  2. End session with failing tests
  3. Cancel

Choice [1/2/3]: _
```

### Productive Session
```
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
🎉 Great Session!
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Duration: 6 hours
Stories completed: 3
Commits: 12
Tests: ✅ All passing

Above average productivity! 🚀

Completed:
  ✅ US-0043: Add user profile settings page
  ✅ US-0044: Implement password reset flow
  ✅ US-0045: Add email verification

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
```

## Related Commands

| Command | Purpose |
|---------|---------|
| `/agileflow:session:init` | One-time setup of session harness |
| `/agileflow:session:resume` | Start session with verification |
| `/agileflow:session:status` | Quick view of current session |
| `/agileflow:session:history` | View past sessions and analytics |

## Integration Points

### Reads
- `docs/09-agents/session-state.json` - Current session
- `docs/09-agents/status.json` - Story status
- Git log - Commits during session

### Updates
- `docs/09-agents/session-state.json` - Moves current to last, updates history

### Optionally Runs
- `/agileflow:verify` - Final test check

## Implementation Notes

1. **Safe**: Never loses work - only records metadata
2. **Summarizing**: Provides clear recap of accomplishments
3. **Forward-Looking**: Suggests what to work on next
4. **Flexible**: Can end with failing tests or uncommitted changes
5. **Analytics-Ready**: Updates history for tracking over time

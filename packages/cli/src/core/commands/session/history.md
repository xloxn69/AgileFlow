---
description: View past session history and metrics
argument-hint: [DAYS=7|30|90|all]
---

# Session History

You are running the `/agileflow:session:history` command to view past session history, productivity metrics, and trends over time.

## Command Purpose

Analytics view of your session history showing:
- Past sessions with duration and accomplishments
- Productivity trends over time
- Test regression frequency
- Average session length and story completion rate

## Arguments

| Argument | Description | Default |
|----------|-------------|---------|
| `DAYS` | Time period to show | `7` (last 7 days) |

**Examples:**
- `/agileflow:session:history` - Last 7 days
- `/agileflow:session:history DAYS=30` - Last 30 days
- `/agileflow:session:history DAYS=all` - All time

## Execution Flow

### 1. Load Session History

Read from `docs/09-agents/session-state.json`:

```bash
HISTORY=$(jq '.session_history' docs/09-agents/session-state.json)
```

### 2. Filter by Time Period

```bash
if [ "$DAYS" == "all" ]; then
  FILTERED_HISTORY="$HISTORY"
else
  CUTOFF_DATE=$(date -d "-$DAYS days" +%Y-%m-%d)
  FILTERED_HISTORY=$(echo "$HISTORY" | jq --arg cutoff "$CUTOFF_DATE" '[.[] | select(.date >= $cutoff)]')
fi
```

### 3. Calculate Metrics

```bash
# Total sessions
TOTAL_SESSIONS=$(echo "$FILTERED_HISTORY" | jq '[.[].sessions] | add')

# Total time
TOTAL_MINUTES=$(echo "$FILTERED_HISTORY" | jq '[.[].total_duration_minutes] | add')

# Stories completed
TOTAL_STORIES=$(echo "$FILTERED_HISTORY" | jq '[.[].stories_completed] | add')

# Test regressions
TOTAL_REGRESSIONS=$(echo "$FILTERED_HISTORY" | jq '[.[].test_regressions] | add')

# Averages
AVG_SESSION_LENGTH=$((TOTAL_MINUTES / TOTAL_SESSIONS))
AVG_STORIES_PER_SESSION=$(echo "scale=2; $TOTAL_STORIES / $TOTAL_SESSIONS" | bc)
```

### 4. Display History

```
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
📊 Session History (Last 7 Days)
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
📈 Summary
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Total Sessions: 12
Total Time: 32 hours 45 minutes
Stories Completed: 8
Test Regressions: 1

Averages:
  • Session length: 2h 44m
  • Stories per session: 0.67
  • Stories per day: 1.14

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
📅 Daily Breakdown
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Mon Dec 16  │ ██████████████ 4h 30m │ 1 story  │ 3 commits │ ✅
Sun Dec 15  │ ████████████   4h 00m │ 2 stories │ 5 commits │ ✅
Sat Dec 14  │ ██████         2h 00m │ 0 stories │ 2 commits │ ✅
Fri Dec 13  │ ████████████████ 5h 15m │ 2 stories │ 8 commits │ ⚠️ regression
Thu Dec 12  │ ██████████████ 4h 30m │ 1 story  │ 4 commits │ ✅
Wed Dec 11  │ ████████████████████ 6h 30m │ 2 stories │ 10 commits │ ✅
Tue Dec 10  │ ████████████   4h 00m │ 0 stories │ 3 commits │ ✅

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
📋 Session Details
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Mon Dec 16 (1 session):
  sess-20251216-140000
  │ Duration: 4h 30m
  │ Stories: US-0043 ✅
  │ Commits: 3
  │ Tests: ✅ passing

Sun Dec 15 (2 sessions):
  sess-20251215-140000
  │ Duration: 2h 15m
  │ Stories: US-0041 ✅
  │ Commits: 3
  │ Tests: ✅ passing

  sess-20251215-090000
  │ Duration: 1h 45m
  │ Stories: US-0042 ✅
  │ Commits: 2
  │ Tests: ✅ passing

Fri Dec 13 (1 session):
  sess-20251213-100000
  │ Duration: 5h 15m
  │ Stories: US-0039 ✅, US-0040 ✅
  │ Commits: 8
  │ Tests: ⚠️ regression detected
  │ Notes: Auth tests broke, fixed same session

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
📊 Trends
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Productivity (stories/week):
  This week:  █████████████████████ 8
  Last week:  ████████████████     6
  2 weeks ago: ██████████████       5

Session length trend:
  Avg this week:  2h 44m ↑
  Avg last week:  2h 10m
  Avg 2 weeks ago: 1h 55m

Test stability:
  This week:  1 regression (fixed same day)
  Last week:  0 regressions
  2 weeks ago: 2 regressions

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
```

## Output Variations

### No History
```
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
📊 Session History
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

No session history found.

Start tracking sessions with:
  1. /agileflow:session:init (one-time setup)
  2. /agileflow:session:resume (each session)
  3. /agileflow:session:end (end of session)

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
```

### 30-Day Summary View
```
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
📊 Session History (Last 30 Days)
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Total Sessions: 45
Total Time: 98 hours 30 minutes
Stories Completed: 32
Test Regressions: 3

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
📅 Weekly Summary
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Week of Dec 16:  █████████████████████ 8 stories │ 22h │ 12 sessions
Week of Dec 9:   ██████████████████   6 stories │ 18h │ 10 sessions
Week of Dec 2:   ████████████████████ 7 stories │ 24h │ 11 sessions
Week of Nov 25:  ████████████████████████████ 11 stories │ 34h │ 12 sessions

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
📈 Monthly Metrics
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Average:
  • Sessions per week: 11.25
  • Hours per week: 24.6h
  • Stories per week: 8.0

Best day: Nov 27 (5 stories, 6h session)
Most active: Wednesdays (avg 4.2h)
Least active: Saturdays (avg 1.5h)

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
```

### All Time Stats
```
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
📊 Session History (All Time)
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Since: October 15, 2025 (62 days ago)

Total Sessions: 156
Total Time: 312 hours
Stories Completed: 98
Epics Completed: 4
Test Regressions: 8

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
📅 Monthly Summary
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Dec 2025:  ████████████████████ 32 stories │ 98h
Nov 2025:  ██████████████████████████████ 48 stories │ 156h
Oct 2025:  ████████████         18 stories │ 58h

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
🏆 Milestones
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

✅ 100 stories completed (Dec 10, 2025)
✅ 100 hours tracked (Nov 28, 2025)
✅ First epic completed (Nov 15, 2025)
✅ First session (Oct 15, 2025)

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
```

## Related Commands

| Command | Purpose |
|---------|---------|
| `/agileflow:session:init` | One-time setup of session harness |
| `/agileflow:session:resume` | Start session with verification |
| `/agileflow:session:status` | Quick view of current session |
| `/agileflow:session:end` | Cleanly end session and record summary |
| `/agileflow:metrics` | Full project analytics dashboard |
| `/agileflow:velocity` | Sprint velocity tracking |

## Integration Points

### Reads
- `docs/09-agents/session-state.json` - Session history
- `docs/09-agents/status.json` - Story completion data

### Does NOT
- Modify any files
- Start or end sessions
- Run tests

## Implementation Notes

1. **Read-Only**: Never modifies files
2. **Flexible Time Ranges**: 7, 30, 90 days, or all time
3. **Visual**: Uses ASCII charts for trends
4. **Actionable**: Shows patterns to optimize work habits
5. **Performance**: Handles large histories efficiently

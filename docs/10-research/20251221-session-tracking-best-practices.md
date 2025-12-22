# Developer Session Tracking Best Practices

**Research Date**: 2025-12-21
**Topic**: Developer session tracking, productivity analytics, and session state management
**Use Case**: Implementing AgileFlow session harness (init, resume, status, end, history commands)
**Sources**: WakaTime, Code Time, RescueTime, SPACE framework, DORA metrics, Pluralsight Flow

---

## Summary

Developer session tracking should focus on meaningful context restoration rather than gameable metrics. Key patterns from existing tools:
- **Heartbeat/event → sessionization** (WakaTime/Code Time): Record activity events, merge into sessions if gaps < idle threshold (typically 15 min)
- **Per-day rollups** (RescueTime): Daily summaries in user's timezone, treated as point-in-time snapshots
- Store timestamps in **UTC with display timezone**, use atomic file writes, and avoid single-number "productivity scores"

---

## 1. Best Practices from Existing Tools

### How Sessions Are Defined

| Tool | Pattern | Notes |
|------|---------|-------|
| WakaTime | Heartbeat → sessions | Small activity events merged if gaps < 15 min idle threshold |
| Code Time | Similar heartbeat | Distinguishes "code time" vs "active code time", tracks KPM |
| RescueTime | Daily rollups | Summaries computed in user's timezone, point-in-time snapshots |

### Metadata Tracked by Tools

**WakaTime heartbeat fields** (good inspiration):
- `entity` (file), `type` (file/domain/app), `project`, `branch`, `language`
- `is_write`, `cursor/line info`, `line-changes` (human/AI split)
- `dependencies`, `timestamp`, `user_agent`

**Code Time metrics**:
- Code time vs active code time
- KPM (keystrokes/min)
- 15-min inactivity cutoff for sessions
- Heatmaps, commit velocity

**RescueTime Daily Summary**:
- Total time logged
- Time by productivity levels
- Productivity pulse
- Time by major category

---

## 2. Recommended session-state.json Schema

Optimized for AgileFlow CLI commands (init, resume, status, end, history) and safe crash recovery:

```json
{
  "schema_version": 1,
  "paths": {
    "session_state": "docs/09-agents/session-state.json",
    "environment": "docs/00-meta/environment.json",
    "story_status": "docs/09-agents/status.json"
  },

  "settings": {
    "idle_cutoff_minutes": 15,
    "auto_close_abandoned_minutes": 240,
    "history_retention_days": 365,
    "timestamps": { "store": "utc", "display_tz": "America/New_York" }
  },

  "active": {
    "session_id": "01JFS9K6Y2K7W6Y1P6K9Q7H0Q4",
    "started_at_utc": "2025-12-21T15:02:10Z",
    "last_seen_at_utc": "2025-12-21T16:18:03Z",
    "status": "active"
  },

  "sessions": [
    {
      "id": "01JFS9K6Y2K7W6Y1P6K9Q7H0Q4",
      "status": "ended",
      "end_reason": "user_end",
      "created_at_utc": "2025-12-21T15:02:10Z",
      "started_at_utc": "2025-12-21T15:02:10Z",
      "ended_at_utc": "2025-12-21T17:11:42Z",
      "display_tz": "America/New_York",

      "environment": {
        "cli_version": "0.9.0",
        "hostname_hash": "sha256:...",
        "os": "darwin",
        "shell": "zsh"
      },

      "repo": {
        "root_hash": "sha256:...",
        "remote_url_hash": "sha256:...",
        "branch_start": "feature/session-tracking",
        "branch_end": "feature/session-tracking",
        "head_sha_start": "a1b2c3d",
        "head_sha_end": "d4e5f6g"
      },

      "work_scope": {
        "epics": ["EPIC-123"],
        "stories_planned": ["STORY-10", "STORY-12"],
        "stories_completed": ["STORY-10"],
        "stories_in_progress": ["STORY-12"],
        "source": "status.json"
      },

      "git": {
        "commit_count": 3,
        "commits": [
          {
            "sha": "d4e5f6g",
            "timestamp_utc": "2025-12-21T16:40:11Z",
            "message_subject": "Add session-state schema v1",
            "files_changed": 5,
            "insertions": 120,
            "deletions": 22
          }
        ],
        "files_touched_top": [
          { "path_hash": "sha256:...", "touch_count": 8 }
        ]
      },

      "tests": {
        "last_run": {
          "run_id": "01JFSB...XYZ",
          "command": "npm test",
          "started_at_utc": "2025-12-21T16:55:02Z",
          "ended_at_utc": "2025-12-21T16:58:44Z",
          "duration_sec": 222,
          "summary": { "passed": 812, "failed": 2, "skipped": 11 },
          "failed_tests": [
            { "id": "pkg.module::test_name", "failure_fingerprint": "sha256:..." }
          ],
          "head_sha": "d4e5f6g"
        },
        "regressions": [
          {
            "detected_at_utc": "2025-12-21T16:58:44Z",
            "baseline_head_sha": "a1b2c3d",
            "current_head_sha": "d4e5f6g",
            "new_failures": ["pkg.module::test_name"],
            "fixed_failures": [],
            "suspect_commits": ["b7c8d9e", "c0ffee1"]
          }
        ]
      },

      "activity": {
        "idle_cutoff_minutes": 15,
        "segments": [
          { "start_utc": "2025-12-21T15:02:10Z", "end_utc": "2025-12-21T15:48:01Z", "kind": "active" },
          { "start_utc": "2025-12-21T15:48:01Z", "end_utc": "2025-12-21T16:07:35Z", "kind": "idle" }
        ]
      },

      "metrics": {
        "duration_sec": 7760,
        "active_sec_est": 6120,
        "idle_sec_est": 1640,
        "stories_completed": 1,
        "stories_per_hour": 0.46,
        "commits_per_hour": 1.39,
        "tests_failed": 2
      },

      "resume_context": {
        "summary": "Worked on schema + regression detection, ended with 2 failing tests.",
        "next_actions": [
          "Fix pkg.module::test_name",
          "Wire status.json story completion into end command"
        ]
      }
    }
  ],

  "aggregates": {
    "daily": {
      "2025-12-21": {
        "sessions": 2,
        "active_sec_est": 12800,
        "stories_completed": 3,
        "tests_failed_total": 2
      }
    }
  }
}
```

### Why This Shape Works

- **`active`** is small → `resume/status` is O(1) without scanning history
- **`sessions[]`** is append-only-ish (safe for crash recovery)
- **`aggregates`** keeps history fast without a database

---

## 3. Specific Metrics Worth Tracking

### Session-Level (Inner Loop)

| Metric | Why | Source |
|--------|-----|--------|
| Duration + active vs idle | Core session tracking; 15-min idle matches tooling norms | WakaTime |
| Stories completed/hour | AgileFlow's core value metric tied to status.json | - |
| Test signal | Pass/fail counts, new failures vs baseline, flaky detection | pytest |
| Commit + change size | Context, not "productivity score" | Git |

### Trend-Level (Learning)

| Framework | What It Measures |
|-----------|------------------|
| **SPACE** | Satisfaction, Performance, Activity, Communication, Efficiency - not just output |
| **DORA/Four Keys** | Deployment frequency, lead time, change failure rate, time to restore |
| **Flow** | Cycle time, time-to-merge, review latency |
| **Coding Days** | Days/week with at least one commit (consistency, not quality) |

### Baseline Guidance

Don't hard-code "productive session length." Instead:
- Compute user's **median active-segment length**
- Show "best sessions happen around X–Y minutes"
- Emphasize personal baselines/averages (Code Time pattern)

---

## 4. Regression Detection Best Practices

### What to Store Per Test Run

Store enough to answer: **"What broke, when, and likely why?"**

- `head_sha`, test command, env fingerprint
- Counts: passed/failed/skipped
- Failed test IDs + "failure fingerprint" hash (test id + top stack trace + exception type)

### Detecting Regressions Between Sessions

```
new_failures = current_failed - baseline_failed
fixed_failures = baseline_failed - current_failed
```

**Flaky tests**: A test that passes and fails for the same commit across runs. Store `(test_id, head_sha) -> last outcomes`.

### Attributing to Commits

- If you have good SHA and bad SHA: `git bisect run <test-cmd>`
- Shortcut: If regression appears right after a single commit, mark it as prime suspect

### Fast Feedback Trick

Support "rerun last failures" using cached failing tests (pytest `--lf/--last-failed` pattern)

---

## 5. Session History & Analytics

### Retention

| Data Type | Retention |
|-----------|-----------|
| Raw sessions | 90-365 days (configurable) |
| Daily/weekly aggregates | Much longer |

Expose a `history_retention_days` setting.

### Rolling Averages vs Point-in-Time

Show both:
- **7-day rolling** for momentum
- **28/90-day rolling** for seasonality
- Mark summaries as "point in time" snapshots (RescueTime pattern)

### CLI Visualizations That Work

| Visualization | Purpose |
|---------------|---------|
| Sparklines | Session length / stories-per-hour trends |
| Weekly heatmap (ASCII) | "When you do your best work" |
| Top 5 lists | Stories completed, tests fixed/broken, most-touched files |

### Aggregation Strategy

Compute and store daily rollups at session end time. Re-aggregate on-demand if schema version changes.

---

## 6. Context Loading on Resume

On resume, load a **short, high-signal bundle**:

1. **Last session summary** + end state (branch, head SHA, what was completed)
2. **Open stories** (in_progress / planned but not completed)
3. **Last test status** + regressions (new failures since last green)
4. **Last commits** in the session (subjects only)
5. **Next actions** (user-editable list)

This matches how dev tools surface "recent activity" rather than raw event logs.

---

## 7. Technical Implementation

### JSON vs SQLite

| Approach | Pros | Cons |
|----------|------|------|
| **JSON** (current) | Simple, human-reviewable, easy to version | File grows, whole-file rewrite, fragile concurrency |
| **SQLite** | Atomic transactions, concurrent readers, fast analytics | Heavier overhead, less "docs-friendly" |

**Recommendation**: Keep `session-state.json` as control plane (active pointer + recent summaries). Optionally add `session-events.jsonl` or SQLite as data plane when analytics grows.

### File Locking & Crash Safety

1. **Atomic replace**: Write temp → fsync → rename
2. **Lock file**: Advisory lock for concurrent CLI invocations
3. **Auto-close abandoned**: If `last_seen_at` too old, set `end_reason = "crash" | "timeout"`

### Time Zones

- Store timestamps in **UTC ISO-8601**
- Store IANA timezone for display (e.g., `America/New_York`)
- Rollups tied to user-selected timezone

---

## 8. Anti-Patterns to Avoid

| Anti-Pattern | Why It's Bad |
|--------------|--------------|
| Single-number "productivity score" | SPACE framework: productivity can't be captured by one dimension |
| LOC/commit counts as KPIs | Easy to game, penalizes refactors/tests/docs |
| Comparing developers against each other | Encourages gaming, damages trust |
| Ignoring flakiness | Regressions become noise without flaky detection |
| Raw file paths in plaintext | Privacy concern; hash or redact |
| Local timestamps without timezone | Breaks day/week rollups and "yesterday" logic |

---

## 9. Open-Source Implementations to Study

| Project | What to Learn |
|---------|---------------|
| [wakatime-cli](https://github.com/wakatime/wakatime-cli) | Heartbeat model, ID generation, field set |
| [Wakapi](https://github.com/muety/wakapi) | Self-hosted backend, retention knobs, scaling |
| [Code Time](https://github.com/swdotcom/swdc-vscode) | UX patterns for daily metrics and summaries |
| [Timewarrior](https://timewarrior.net/) | JSON export format for interval tracking |
| [Taskwarrior](https://taskwarrior.org/) | Export patterns (JSON with UUIDs, timestamps) |

---

## 10. Simplified Schema for AgileFlow MVP

For initial implementation, a **simplified schema** that maps directly to existing commands:

```json
{
  "schema_version": 1,
  "settings": {
    "idle_cutoff_minutes": 15,
    "history_retention_days": 90
  },

  "current_session": {
    "id": "sess-20251221-150210",
    "started_at": "2025-12-21T15:02:10Z",
    "last_activity": "2025-12-21T16:18:03Z",
    "branch": "main",
    "head_sha_start": "a1b2c3d",
    "current_story": "US-0043",
    "test_status": "passing",
    "commits_count": 0
  },

  "last_session": {
    "id": "sess-20251220-140000",
    "started_at": "2025-12-20T14:00:00Z",
    "ended_at": "2025-12-20T18:30:00Z",
    "duration_minutes": 270,
    "stories_completed": ["US-0041", "US-0042"],
    "commits": ["abc123", "def456"],
    "test_status": "passing",
    "end_reason": "user_end"
  },

  "session_history": [
    {
      "date": "2025-12-20",
      "sessions": 2,
      "duration_minutes": 450,
      "stories_completed": 3,
      "commits": 8,
      "test_regressions": 0
    }
  ]
}
```

This matches what the existing commands expect while incorporating best practices.

---

## References

1. [WakaTime API Docs - Heartbeat Fields](https://wakatime.com/developers#heartbeats) (2025-12-21)
2. [Code Time - Data Dashboard](https://software.com/code-time) (2025-12-21)
3. [RescueTime - Daily Summary](https://www.rescuetime.com/rtx/reports/daily-summary) (2025-12-21)
4. [SPACE Framework - ACM Queue](https://queue.acm.org/detail.cfm?id=3454124) (2025-12-21)
5. [DORA Metrics](https://dora.dev/quickcheck/) (2025-12-21)
6. [Pluralsight Flow](https://www.pluralsight.com/product/flow) (2025-12-21)
7. [pytest --last-failed](https://docs.pytest.org/en/stable/how-to/cache.html) (2025-12-21)
8. [git bisect run](https://git-scm.com/docs/git-bisect) (2025-12-21)

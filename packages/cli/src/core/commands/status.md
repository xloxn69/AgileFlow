---
description: Update story status and progress
argument-hint: STORY=<US-ID> STATUS=<status> [SUMMARY=<text>] [PR=<url>] [TO=<agent-id>]
---

# status

Update story status and broadcast to agents via message bus.

---

## STEP 0: Gather Context

```bash
node scripts/obtain-context.js status
```

This gathers git status, stories/epics, session state, and registers for PreCompact.

---

## Context Loading (Documentation)

**PURPOSE**: Immediately load full context before executing any logic.

**ACTIONS**:
1. Read `/home/coder/AgileFlow/packages/cli/src/core/commands/status.md` (this file) in its entirety
2. Absorb all instructions, rules, and examples
3. Proceed to execution phase with complete context

**WHY**: Prevents incomplete instruction loading and ensures consistent behavior.

---

<!-- COMPACT_SUMMARY_START -->
## Compact Summary
- **Command**: /agileflow:status
- **Purpose**: Update story status and broadcast to agents
- **Arguments**: STORY=<US-ID> STATUS=<status> [SUMMARY=<text>] [PR=<url>] [TO=<agent-id>]
- **Status Values**: in-progress, blocked, in-review, done
- **Key Actions**:
  1. Update docs/09-agents/status.json (status, summary, last_update, pr)
  2. Validate JSON after update using jq
  3. Append bus line to docs/09-agents/bus/log.jsonl
- **JSON Safety**: ALWAYS use jq or Edit tool (never echo/cat > status.json)
- **Validation**: Run jq empty check after ANY modification
- **Bus Message**: {ts, from, to, type:"status", story, text}
- **Backup**: Restore from docs/09-agents/status.json.backup if validation fails
- **Output**: Diff-first, then YES/NO confirmation
- **Critical**: User text automatically escaped by jq
- **Related**: docs/09-agents/status.json, bus/log.jsonl, scripts/validate-json.sh
<!-- COMPACT_SUMMARY_END -->

---

## Prompt

ROLE: Status Updater

INPUTS
STORY=<US-ID>  STATUS=in-progress|blocked|in-review|done
SUMMARY=<1–2 lines>  PR=<url optional>  TO=<agent id optional>

ACTIONS
1) Update docs/09-agents/status.json (status,summary,last_update,pr).
   **CRITICAL**: Always use jq for JSON operations to prevent corruption.
2) **Validate JSON after update**:
   ```bash
   # Validate status.json after modification
   if ! jq empty docs/09-agents/status.json 2>/dev/null; then
     echo "❌ ERROR: status.json is now invalid JSON after update!"
     echo "Run: bash scripts/validate-json.sh docs/09-agents/status.json"
     exit 1
   fi
   ```
3) Append a bus line: {"ts":now,"from":"<self>","to":"<TO or ALL>","type":"status","story":"<STORY>","text":"<SUMMARY>"}.

**JSON Safety Guidelines**:
- ALWAYS use jq or the Edit tool (never echo/cat > status.json)
- User-provided text (summaries, descriptions) is automatically escaped by jq
- Validate status.json after ANY modification
- If validation fails, restore from backup: docs/09-agents/status.json.backup

Diff-first; YES/NO.

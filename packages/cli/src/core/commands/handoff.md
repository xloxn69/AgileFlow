---
description: Document work handoff between agents
argument-hint: STORY=<US-ID> FROM=<id> TO=<id> [SUMMARY=<text>] [BLOCKERS=<list>]
---

# handoff

STEP 0: ACTIVATE COMPACT SUMMARY MODE
Before reading the full command, execute this script to display the compact summary:
```bash
sed -n '/<!-- COMPACT_SUMMARY_START -->/,/<!-- COMPACT_SUMMARY_END -->/p' "$(dirname "$0")/handoff.md" | grep -v "COMPACT_SUMMARY"
```
If the user confirms they want the full details, continue. Otherwise, stop here.

Document handoff between agents with summary and blockers.

<!-- COMPACT_SUMMARY_START -->
## Compact Summary

**Purpose**: Document work handoffs between agents on a story

**Quick Usage**:
```
/handoff STORY=US-0042 FROM=agent-a TO=agent-b SUMMARY="Completed API integration" BLOCKERS="Need database schema review"
```

**What It Does**:
1. Creates handoff note: `docs/09-agents/comms/<STORY>-<YYYYMMDD>-handoff.md`
2. Logs to agent bus: `docs/09-agents/bus/log.jsonl` (type="handoff")
3. Tracks who, what, when, and any blockers

**Required Inputs**:
- `STORY=<US-ID>` - Story ID (e.g., US-0042)
- `FROM=<agent-id>` - Handing off agent
- `TO=<agent-id>` - Receiving agent
- `SUMMARY=<text>` - What was accomplished/status

**Optional Inputs**:
- `BLOCKERS=<list>` - Known blockers or issues

**Output Files**:
- Handoff note in `docs/09-agents/comms/`
- Bus log entry in `docs/09-agents/bus/log.jsonl`

**Template Used**: `@packages/cli/src/core/templates/comms-note-template.md`

**Workflow**:
1. Parse all inputs (STORY, FROM, TO, SUMMARY, BLOCKERS)
2. Generate handoff note from template
3. Append to agent bus log
4. Show preview, wait for YES/NO confirmation
5. Write files only after approval

**Example Handoff Note**:
```markdown
# Handoff: US-0042

From: agent-a
To: agent-b
Date: 2025-12-22

## Summary
Completed API integration with authentication middleware.
All endpoints tested and passing.

## Blockers
- Database schema needs DBA review before migration
- Redis cache configuration pending DevOps approval
```

**Use When**:
- Switching agents on a story
- Documenting progress before pause
- Highlighting blockers for next agent
- Creating audit trail of work transitions
<!-- COMPACT_SUMMARY_END -->

## Prompt

ROLE: Handoff Scribe

TODO LIST TRACKING
**CRITICAL**: Immediately create a todo list using TodoWrite tool to track handoff documentation:
```
1. Parse inputs (STORY, FROM, TO, SUMMARY, BLOCKERS)
2. Create docs/09-agents/comms/<STORY>-<YYYYMMDD>-handoff.md
3. Append bus line with type="handoff"
4. Show preview and wait for YES/NO confirmation
```

Mark each step complete as you finish it. This ensures nothing is forgotten.

INPUTS
STORY=<US-ID>  FROM=<id>  TO=<id>
SUMMARY=<what changed>  BLOCKERS=<optional list>

TEMPLATE
Use the following comms note template:
@packages/cli/src/core/templates/comms-note-template.md

ACTIONS
1) Create docs/09-agents/comms/<STORY>-<YYYYMMDD>-handoff.md from comms-note-template.md.
2) Append bus line type="handoff".

Diff-first; YES/NO.

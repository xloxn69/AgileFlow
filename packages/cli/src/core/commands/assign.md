---
description: Assign or reassign a story to an owner
argument-hint: STORY=<US-ID> NEW_OWNER=<id> [NEW_STATUS=<status>] [NOTE=<text>]
---

# assign

Assign or reassign a story to an owner with status update.

## STEP 0: Gather Context

```bash
node scripts/obtain-context.js assign
```

<!-- COMPACT_SUMMARY_START -->
## Compact Summary

**Command**: `assign`
**Purpose**: Assign or reassign stories to owners with status updates

**Quick Usage**:
```
/agileflow:assign STORY=US-0042 NEW_OWNER=AG-UI NEW_STATUS=in-progress NOTE="Starting work on login form"
```

**What It Does**:
1. Updates story frontmatter (owner, status, updated timestamp) in `docs/06-stories/**/<STORY>*.md`
2. Updates `docs/09-agents/status.json` (owner, status, last_update) using jq or Edit tool
3. Validates JSON after modification (prevents corruption)
4. Appends "assign" event to `docs/09-agents/bus/log.jsonl`

**Status Values**:
- `ready` - Story ready to start
- `in-progress` - Currently being worked on
- `blocked` - Waiting on dependency
- `in-review` - Code review in progress
- `done` - Completed and verified

**JSON Safety Protocol**:
- **ALWAYS** use jq or Edit tool for JSON operations
- **NEVER** use echo/cat > status.json (can corrupt JSON)
- **VALIDATE** after modification:
  ```bash
  if ! jq empty docs/09-agents/status.json 2>/dev/null; then
    echo "❌ ERROR: status.json is now invalid JSON!"
    exit 1
  fi
  ```

**Example Workflow**:
```
1. Story US-0042 created (owner: unassigned, status: ready)
2. /agileflow:assign STORY=US-0042 NEW_OWNER=AG-UI NEW_STATUS=in-progress
3. AG-UI works on story
4. /agileflow:assign STORY=US-0042 NEW_OWNER=AG-UI NEW_STATUS=in-review
5. Review complete
6. /agileflow:assign STORY=US-0042 NEW_OWNER=AG-UI NEW_STATUS=done
```

**Best Practices**:
- Always preview changes before confirming (diff-first)
- Include NOTE for context on status changes
- Validate JSON after every update
- Use appropriate status transitions (ready → in-progress → in-review → done)

<!-- COMPACT_SUMMARY_END -->

## Prompt

ROLE: Assigner

INPUTS
STORY=<US-ID>  NEW_OWNER=<id>  NEW_STATUS=ready|in-progress|blocked|in-review|done  NOTE=<short text>

ACTIONS
1) Update story frontmatter (owner,status,updated) in docs/06-stories/**/<STORY>*.
2) Merge docs/09-agents/status.json (owner,status,last_update).
   **CRITICAL**: Always use jq or Edit tool for JSON operations.
3) **Validate JSON after update**:
   ```bash
   # Validate status.json after modification
   if ! jq empty docs/09-agents/status.json 2>/dev/null; then
     echo "❌ ERROR: status.json is now invalid JSON!"
     echo "Run: bash scripts/validate-json.sh docs/09-agents/status.json"
     exit 1
   fi
   ```
4) Append bus/log.jsonl "assign" line.

**JSON Safety**: Always use jq or Edit tool (never echo/cat > status.json). Validate after modifications.

Preview changes; YES/NO.

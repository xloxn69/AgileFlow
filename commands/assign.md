---
description: assign
allowed-tools: Bash, Read, Edit, Write, Glob, Grep
---

# assign

Assign or reassign a story to an owner with status update.

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

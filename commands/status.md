---
description: Update story status and progress
allowed-tools: Bash, Read, Edit, Write, Glob, Grep
---

# status

Update story status and broadcast to agents via message bus.

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

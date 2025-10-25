# assign

Assign or reassign a story to an owner with status update.

## Prompt

ROLE: Assigner

INPUTS
STORY=<US-ID>  NEW_OWNER=<id>  NEW_STATUS=ready|in-progress|blocked|in-review|done  NOTE=<short text>

ACTIONS
1) Update story frontmatter (owner,status,updated) in docs/06-stories/**/<STORY>*.
2) Merge docs/09-agents/status.json (owner,status,last_update).
3) Append bus/log.jsonl "assign" line.

Preview changes; YES/NO.

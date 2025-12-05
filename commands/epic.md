---
description: Create a new epic with stories
allowed-tools: Bash, Read, Edit, Write, Glob, Grep
---

# epic-new

Create a new epic with optional child stories.

## Prompt

ROLE: Epic Creator

INPUTS
EPIC=<ID e.g., EP-0001>
TITLE=<Epic title>
OWNER=<name or agent id>
GOAL=<outcome/metric>
STORIES=<optional> comma-separated "<US_ID>|<short title>|<owner>"

ACTIONS
1) Create docs/05-epics/<EPIC>.md from epic-template.md (status=active; created/updated=now).
2) For each story, create docs/06-stories/<EPIC>/<US_ID>-<slug>.md from story-template.md (status=ready; estimate=0.5d; deps=[]).
3) Merge entries into docs/09-agents/status.json (owner,status,branch,summary,last_update).
4) Append "assign" lines to docs/09-agents/bus/log.jsonl.

Always show previews; YES/NO before writing.

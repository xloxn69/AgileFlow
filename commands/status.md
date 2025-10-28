---
description: status
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
2) Append a bus line: {"ts":now,"from":"<self>","to":"<TO or ALL>","type":"status","story":"<STORY>","text":"<SUMMARY>"}.

Diff-first; YES/NO.

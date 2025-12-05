---
description: Document work handoff between agents
allowed-tools: Bash, Read, Edit, Write, Glob, Grep
---

# handoff

Document handoff between agents with summary and blockers.

## Prompt

ROLE: Handoff Scribe

INPUTS
STORY=<US-ID>  FROM=<id>  TO=<id>
SUMMARY=<what changed>  BLOCKERS=<optional list>

ACTIONS
1) Create docs/09-agents/comms/<STORY>-<YYYYMMDD>-handoff.md from comms-note-template.md.
2) Append bus line type="handoff".

Diff-first; YES/NO.

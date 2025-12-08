---
description: Document work handoff between agents
allowed-tools: Bash, Read, Edit, Write, Glob, Grep
---

# handoff

Document handoff between agents with summary and blockers.

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

ACTIONS
1) Create docs/09-agents/comms/<STORY>-<YYYYMMDD>-handoff.md from comms-note-template.md.
2) Append bus line type="handoff".

Diff-first; YES/NO.

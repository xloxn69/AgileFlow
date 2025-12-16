---
description: Initialize research note with structured template
---

# research-init

Initialize or save research notes to the research folder.

## Prompt

ROLE: Research Initializer

OBJECTIVE
Evaluate and organize research findings with structured analysis. Assess relevance, consider key insights, and examine sources to create comprehensive research documentation.

TODO LIST TRACKING
**CRITICAL**: Immediately create a todo list using TodoWrite tool to track research initialization:
```
1. Ensure docs/10-research/ exists
2. Create/update docs/10-research/README.md (if missing)
3. If pasted research content provided: save to docs/10-research/<YYYYMMDD>-<slug>.md
4. Add entry to README.md index table
5. Show preview and wait for YES/NO confirmation
```

Mark each step complete as you finish it. This ensures nothing is forgotten.

ACTIONS
1) Ensure docs/10-research/ exists with README.md (index table: Date | Topic | Path | Summary).
2) If pasted research content is provided, save to docs/10-research/<YYYYMMDD>-<slug>.md and add a row to README.md (newest first).

Diff-first; YES/NO.

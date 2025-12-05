---
description: Initialize research note with structured template
allowed-tools: Bash, Read, Edit, Write, Glob, Grep
---

# research-init

Initialize or save research notes to the research folder.

## Prompt

ROLE: Research Initializer

ACTIONS
1) Ensure docs/10-research/ exists with README.md (index table: Date | Topic | Path | Summary).
2) If pasted research content is provided, save to docs/10-research/<YYYYMMDD>-<slug>.md and add a row to README.md (newest first).

Diff-first; YES/NO.

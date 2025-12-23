---
description: Initialize research note with structured template
---

# research-init

Initialize or save research notes to the research folder.

---

## STEP 0: Gather Context

```bash
node .agileflow/scripts/obtain-context.js research
```

---

## Context Loading (Documentation)

**PURPOSE**: Immediately load full context before executing any logic.

**ACTIONS**:
1. Read this command file (`.agileflow/commands/research.md`) in its entirety
2. Absorb all instructions, rules, and examples
3. Proceed to execution phase with complete context

**WHY**: Prevents incomplete instruction loading and ensures consistent behavior.

---

<!-- COMPACT_SUMMARY_START -->
## Compact Summary
- **Command**: /agileflow:research-init
- **Purpose**: Initialize or save research notes with structured analysis
- **Objective**: Evaluate and organize research findings
- **TodoList**: Required for tracking 5-step workflow
- **Key Actions**:
  1. Ensure docs/10-research/ exists
  2. Create/update docs/10-research/README.md (index table: Date | Topic | Path | Summary)
  3. If pasted research content provided: save to docs/10-research/<YYYYMMDD>-<slug>.md
  4. Add entry to README.md index table (newest first)
  5. Show preview and wait for YES/NO confirmation
- **File Format**: <YYYYMMDD>-<slug>.md (e.g., 20251222-session-tracking.md)
- **Index Table**: Date | Topic | Path | Summary in README.md
- **Output**: Research note saved to docs/10-research/ with index entry
- **Workflow**: Diff-first, then YES/NO confirmation
- **Related**: docs/10-research/ structure, research organization
<!-- COMPACT_SUMMARY_END -->

---

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

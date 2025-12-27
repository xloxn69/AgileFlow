---
description: Initialize research note with structured template
argument-hint: (no arguments)
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
- **Key Actions**: Ensure docs/10-research/ exists → Create/update index → Save research file → Add index entry → Confirm

### Tool Usage Examples

**TodoWrite** (to track research initialization workflow):
```xml
<invoke name="TodoWrite">
<parameter name="content">1. Ensure docs/10-research/ exists
2. Create/update docs/10-research/README.md (if missing)
3. If pasted research content provided: save to docs/10-research/<YYYYMMDD>-<slug>.md
4. Add entry to README.md index table
5. Show preview and wait for YES/NO confirmation</parameter>
<parameter name="status">in-progress</parameter>
<parameter name="activeForm">1</parameter>
</invoke>
```

**Write** (to create research file):
```xml
<invoke name="Write">
<parameter name="file_path">/full/path/to/docs/10-research/20251222-session-tracking.md</parameter>
<parameter name="content"># Session Tracking

**Research Date**: 2025-12-22
**Topic**: Session tracking implementation
**Sources**: [source citations]

## Summary
[2-3 paragraph executive summary]

## Key Findings
- [Main point 1]
- [Main point 2]

## References
- [Source 1]
- [Source 2]</parameter>
</invoke>
```

**Edit** (to update README.md index):
```xml
<invoke name="Edit">
<parameter name="file_path">/full/path/to/docs/10-research/README.md</parameter>
<parameter name="old_string">| 2025-12-20 | Old Topic | 20251220-old-topic.md | Summary |</parameter>
<parameter name="new_string">| 2025-12-22 | Session Tracking | 20251222-session-tracking.md | Research findings about tracking sessions |
| 2025-12-20 | Old Topic | 20251220-old-topic.md | Summary |</parameter>
</invoke>
```

**AskUserQuestion** (for confirmation):
```xml
<invoke name="AskUserQuestion">
<parameter name="questions">[{"question": "Save this research file?", "header": "Preview", "multiSelect": false, "options": [{"label": "Yes, save to docs/10-research/", "description": "Write the research file and update index"}, {"label": "No, abort", "description": "Cancel without saving"}]}]</parameter>
</invoke>
```

- **File Format**: <YYYYMMDD>-<slug>.md
- **Index Table**: Date | Topic | Path | Summary in README.md
- **Workflow**: Diff-first, then YES/NO confirmation
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

---
description: Export concise context excerpt for web AI tools
argument-hint: (no arguments)
---

# /agileflow:context:export

Export a concise context excerpt for pasting into web AI tools.

---

## Purpose

Reads `docs/context.md` and outputs a condensed excerpt (≤300 lines) ready to paste into ChatGPT, Perplexity, Gemini, or Claude web.

**This is a read-only command** - no files are written.

---

<!-- COMPACT_SUMMARY_START -->
## Compact Summary

**Command**: `/agileflow:context:export`
**Purpose**: Output concise context brief for pasting into web AI tools
**Key Rule**: Read-only, no file writes, ≤300 lines output
<!-- COMPACT_SUMMARY_END -->

---

## IMMEDIATE ACTIONS

Upon invocation, execute these steps:

### Step 1: Read Context File

Read `docs/context.md`. If it doesn't exist, inform user to run `/agileflow:context:full` first.

### Step 2: Extract Key Sections

From the context file, extract only:
- Last updated timestamp
- What we're building (project overview)
- Current focus (active work)
- Tech/tooling summary
- Key decisions (ADRs list)
- Feature map (one line per epic)
- Next steps

### Step 3: Format Output

Output the excerpt in a code block:

```markdown
# Project Context Brief
Last updated: [timestamp]

## What We're Building
[Brief description]

## Current Focus
[Active epics/stories]

## Tech Stack
[Key technologies]

## Key Decisions
[ADR list]

## Feature Map
[Epic status summary]

## Next Steps
[Ready stories]
```

### Step 4: Add Instructions

End with:

```
---
Paste this excerpt into your web AI tool (ChatGPT, Perplexity, Gemini, etc.) to load context.
```

---

## Constraints

- **LIMIT**: ≤300 lines total output
- **NO FILE WRITES**: This is read-only
- **NO TodoWrite needed**: Simple single-step operation

---

## Related Commands

- `/agileflow:context:full` - Generate/refresh full context brief
- `/agileflow:context:note` - Add quick timestamped note
- `/agileflow:research:ask` - Generate research prompt for web AI

---
description: Show research notes index
argument-hint: (no arguments)
---

# /agileflow:research:list

Display the index of all research notes in your project.

---

## Purpose

Shows all research notes stored in `docs/10-research/` with:
- Date
- Topic
- File path
- One-line summary

**This is a read-only command** - no files are written.

---

<!-- COMPACT_SUMMARY_START -->
## Compact Summary

**Command**: `/agileflow:research:list`
**Purpose**: Display research notes index from docs/10-research/README.md
**Key Rule**: Read-only, no file writes
<!-- COMPACT_SUMMARY_END -->

---

## IMMEDIATE ACTIONS

Upon invocation, execute these steps:

### Step 1: Check Research Directory

Verify `docs/10-research/` exists. If not:
```
No research notes found. Use /agileflow:research:ask to generate a research prompt.
```

### Step 2: Read Index File

Read `docs/10-research/README.md` for the index table.

If README.md doesn't exist but research files do, list them by reading the directory.

### Step 3: Display Index

Format output:

```
## Research Notes

| Date | Topic | File |
|------|-------|------|
| 2024-12-31 | OAuth 2.0 Setup | 20241231-oauth-setup.md |
| 2024-12-30 | Session Tracking | 20241230-session-tracking.md |
| 2024-12-28 | Mermaid Diagrams | 20241228-mermaid-diagrams.md |

Total: 3 research notes

Use /agileflow:research:view FILE=<filename> to read a specific note.
```

### Step 4: Suggest Actions

If notes exist:
```
Quick actions:
- /agileflow:research:view FILE=20241231-oauth-setup.md - Read a note
- /agileflow:research:ask TOPIC="new topic" - Create new research prompt
- /agileflow:research:import - Import external content
```

---

## Rules

- **Read-only**: No file writes
- **Handle missing directory**: Graceful message if no research exists
- **Simple output**: Just show the list, no complex formatting

---

## Related Commands

- `/agileflow:research:ask` - Generate research prompt for web AI
- `/agileflow:research:import` - Import research results
- `/agileflow:research:view` - Read specific research note

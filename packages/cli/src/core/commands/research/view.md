---
description: Read a specific research note
argument-hint: FILE=<filename>
---

# /agileflow:research:view

Read and display a specific research note.

---

## Purpose

Displays the content of a research note from `docs/10-research/`. Useful for:
- Reviewing previous research before implementing
- Finding code snippets from past research
- Checking action items from research

**This is a read-only command** - no files are written.

---

<!-- COMPACT_SUMMARY_START -->
## Compact Summary

**Command**: `/agileflow:research:view FILE=<filename>`
**Purpose**: Display contents of a specific research note
**Key Rule**: Read-only, no file writes
<!-- COMPACT_SUMMARY_END -->

---

## Arguments

| Argument | Required | Description |
|----------|----------|-------------|
| FILE | Yes | Filename of the research note (e.g., "20241231-oauth-setup.md") |

---

## IMMEDIATE ACTIONS

Upon invocation, execute these steps:

### Step 1: Validate Input

If FILE not provided, show available files:

```xml
<invoke name="AskUserQuestion">
<parameter name="questions">[{
  "question": "Which research note would you like to view?",
  "header": "Select file",
  "multiSelect": false,
  "options": [
    {"label": "20241231-oauth-setup.md", "description": "OAuth 2.0 Setup"},
    {"label": "20241230-session-tracking.md", "description": "Session Tracking"},
    {"label": "List all notes", "description": "Show full research index"}
  ]
}]</parameter>
</invoke>
```

### Step 2: Read File

Read `docs/10-research/[FILE]`.

If file doesn't exist:
```
Research note not found: [FILE]

Use /agileflow:research:list to see available notes.
```

### Step 3: Display Content

Output the full content of the research note.

### Step 4: Suggest Actions

After displaying:
```
---

Actions:
- /agileflow:research:list - See all research notes
- /agileflow:research:ask TOPIC="new topic" - Create new research
```

---

## Example Usage

```bash
/agileflow:research:view FILE=20241231-oauth-setup.md
/agileflow:research:view FILE=20241228-mermaid-diagrams.md
```

---

## Rules

- **Read-only**: No file writes
- **Full content**: Display entire file, don't truncate
- **Handle missing files**: Graceful error message

---

## Related Commands

- `/agileflow:research:ask` - Generate research prompt for web AI
- `/agileflow:research:import` - Import research results
- `/agileflow:research:list` - Show research notes index

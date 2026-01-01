---
description: Add timestamped note to context file
argument-hint: NOTE=<text>
---

# /agileflow:context:note

Append a timestamped note to the context file.

---

## Purpose

Quickly add a note to `docs/context.md` under the "Notes" section. Useful for recording decisions, observations, or reminders that should persist in project context.

---

<!-- COMPACT_SUMMARY_START -->
## Compact Summary

**Command**: `/agileflow:context:note NOTE="your note here"`
**Purpose**: Append timestamped note to docs/context.md
**Key Rules**: Diff-first, creates Notes section if missing
<!-- COMPACT_SUMMARY_END -->

---

## Arguments

| Argument | Required | Description |
|----------|----------|-------------|
| NOTE | Yes | 1-5 line note text to append |

---

## IMMEDIATE ACTIONS

Upon invocation, execute these steps:

### Step 1: Validate Input

Verify NOTE argument is provided. If missing:

```xml
<invoke name="AskUserQuestion">
<parameter name="questions">[{
  "question": "What note would you like to add?",
  "header": "Note text",
  "multiSelect": false,
  "options": [
    {"label": "Enter note text", "description": "Type your note in the 'Other' field"}
  ]
}]</parameter>
</invoke>
```

### Step 2: Read Context File

Read `docs/context.md`. If it doesn't exist, create it with a Notes section.

### Step 3: Find or Create Notes Section

Look for `## Notes` section. If not found, add it at the end of the file.

### Step 4: Generate Timestamped Entry

Format the note with ISO timestamp:

```markdown
- **[2024-12-31T10:30:00Z]**: [Note text here]
```

### Step 5: Show Diff

Display the change:

```diff
## Notes

+ - **[2024-12-31T10:30:00Z]**: User reported auth bug in production
```

### Step 6: Ask for Confirmation

```xml
<invoke name="AskUserQuestion">
<parameter name="questions">[{
  "question": "Add this note to docs/context.md?",
  "header": "Confirm",
  "multiSelect": false,
  "options": [
    {"label": "Yes, add note", "description": "Append note to file"},
    {"label": "No, cancel", "description": "Cancel without saving"}
  ]
}]</parameter>
</invoke>
```

### Step 7: Apply Changes

If YES: Append the note to the Notes section using Edit tool.

---

## Example Usage

```bash
/agileflow:context:note NOTE="Decided to use JWT instead of sessions"
/agileflow:context:note NOTE="User reported auth bug in production, investigating"
/agileflow:context:note NOTE="Sprint planning: focusing on US-0042 and US-0045 this week"
```

---

## Rules

- Diff-first: Always show changes before writing
- Creates Notes section if it doesn't exist
- ISO timestamp format for all entries
- Notes appear in chronological order (newest at bottom)

---

## Related Commands

- `/agileflow:context:full` - Generate/refresh full context brief
- `/agileflow:context:export` - Export concise excerpt for pasting
- `/agileflow:research:ask` - Generate research prompt for web AI

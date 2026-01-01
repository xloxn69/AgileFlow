---
description: Import research results and save to research folder
argument-hint: TOPIC=<text> [CONTENT=<text>] [SOURCE=<url>]
---

# /agileflow:research:import

Import research results from web AI tools or external content into your research folder.

---

## Purpose

After using `/agileflow:research:ask` to get answers from ChatGPT, Claude web, or other AI tools, use this command to:
- Format the results into structured markdown
- Save to `docs/10-research/YYYYMMDD-topic-slug.md`
- Update the research index
- Optionally link to ADRs, Epics, or Stories

Also works for importing:
- YouTube video transcripts
- Conference talk notes
- Blog posts / articles
- Documentation pages
- Meeting notes

---

<!-- COMPACT_SUMMARY_START -->
## Compact Summary

**Command**: `/agileflow:research:import TOPIC="topic" CONTENT="paste results here"`
**Purpose**: Save research results to docs/10-research/ folder

### Critical Rules
- **Validate inputs**: TOPIC required, CONTENT required (or user pastes after command)
- **Preserve ALL code snippets** exactly as provided
- **Generate actionable items** (not vague suggestions)
- **Diff-first**: Show formatted result before saving
- **Update index**: Always add entry to README.md
<!-- COMPACT_SUMMARY_END -->

---

## Arguments

| Argument | Required | Description |
|----------|----------|-------------|
| TOPIC | Yes | Name for the research file (e.g., "OAuth 2.0 Setup") |
| CONTENT | Yes* | Research results to import (*can be pasted after command) |
| SOURCE | No | Original source URL for attribution |

---

## IMMEDIATE ACTIONS

Upon invocation, execute these steps:

### Step 1: Create Todo List

```xml
<invoke name="TodoWrite">
<parameter name="todos">[
  {"content": "Validate TOPIC and CONTENT", "status": "in_progress", "activeForm": "Validating inputs"},
  {"content": "Analyze and summarize content", "status": "pending", "activeForm": "Analyzing content"},
  {"content": "Extract code snippets", "status": "pending", "activeForm": "Extracting code"},
  {"content": "Generate action items", "status": "pending", "activeForm": "Generating actions"},
  {"content": "Format research file", "status": "pending", "activeForm": "Formatting file"},
  {"content": "Show diff for review", "status": "pending", "activeForm": "Showing preview"},
  {"content": "Save to docs/10-research/", "status": "pending", "activeForm": "Saving file"},
  {"content": "Update README.md index", "status": "pending", "activeForm": "Updating index"},
  {"content": "Offer ADR/Epic/Story linking", "status": "pending", "activeForm": "Offering links"}
]</parameter>
</invoke>
```

### Step 2: Validate Inputs

**TOPIC required**: If missing, ask:
```xml
<invoke name="AskUserQuestion">
<parameter name="questions">[{
  "question": "What topic is this research about?",
  "header": "Topic",
  "multiSelect": false,
  "options": [{"label": "Enter topic", "description": "Type in 'Other' field"}]
}]</parameter>
</invoke>
```

**CONTENT required**: If not provided, wait for user to paste results. Prompt:
"Please paste the research results from ChatGPT/Claude/Perplexity below."

### Step 3: Analyze Content

Extract from the provided content:
- **Summary**: 2-3 paragraph TL;DR
- **Key Findings**: Main takeaways as bullet points
- **Code Snippets**: Any code blocks (preserve exactly)
- **Action Items**: Concrete next steps
- **Story Suggestions**: Potential user stories if applicable

### Step 4: Format Research File

Generate structured markdown:

```markdown
# [Topic Title]

**Import Date**: YYYY-MM-DD
**Topic**: [original topic]
**Source**: [URL if provided, or "ChatGPT/Claude/Perplexity research"]
**Content Type**: [research/transcript/article/notes]

---

## Summary

[2-3 paragraph executive summary of the content]

---

## Key Findings

- [Main point 1 with details]
- [Main point 2 with details]
- [Main point 3 with details]
- [Continue for all key points...]

---

## Implementation Approach

[Step-by-step plan if applicable]

1. [Step 1]
2. [Step 2]
3. [Step 3]

---

## Code Snippets

[Preserve ALL code snippets exactly as provided]

### [Snippet description]

```language
[code here]
```

### [Another snippet]

```language
[code here]
```

---

## Action Items

- [ ] [Action 1 - concrete next step]
- [ ] [Action 2 - concrete next step]
- [ ] [Action 3 - concrete next step]

---

## Risks & Gotchas

[Any warnings, edge cases, or potential issues mentioned]

- [Risk 1]
- [Risk 2]

---

## Story Suggestions

[If content suggests feature work]

### Potential Epic: [Epic Title]

**US-XXXX**: [Story 1 title]
- AC: [acceptance criteria]

**US-XXXX**: [Story 2 title]
- AC: [acceptance criteria]

---

## Raw Content Reference

<details>
<summary>Original content (click to expand)</summary>

[First 1000 chars of original content for reference...]

</details>

---

## References

- Source: [URL or "Direct import"]
- Import date: YYYY-MM-DD
- Related: [links to related docs if applicable]
```

### Step 5: Show Preview

Display the formatted research file for review.

### Step 6: Ask for Confirmation

```xml
<invoke name="AskUserQuestion">
<parameter name="questions">[{
  "question": "Save this research file?",
  "header": "Confirm",
  "multiSelect": false,
  "options": [
    {"label": "Yes, save to docs/10-research/", "description": "Write file and update index"},
    {"label": "No, cancel", "description": "Cancel without saving"}
  ]
}]</parameter>
</invoke>
```

### Step 7: Save Research File

If YES:
- Generate filename: `YYYYMMDD-<topic-slug>.md`
- Save to `docs/10-research/`
- Use Write tool

### Step 8: Update Index

Add entry to `docs/10-research/README.md`:

```markdown
| Date | Topic | File | Summary |
|------|-------|------|---------|
| YYYY-MM-DD | [Topic] | [filename.md] | [One-line summary] |
```

Insert newest entries at the top of the table.

### Step 9: Offer Next Steps

```xml
<invoke name="AskUserQuestion">
<parameter name="questions">[{
  "question": "What would you like to do with this research?",
  "header": "Next Steps",
  "multiSelect": true,
  "options": [
    {"label": "Create ADR referencing this research", "description": "Document an architecture decision"},
    {"label": "Create Epic/Stories from research", "description": "Turn findings into actionable work"},
    {"label": "Link to existing Epic/Story", "description": "Reference from current work"},
    {"label": "Done for now", "description": "No further action needed"}
  ]
}]</parameter>
</invoke>
```

If linking, add to the target document:
```markdown
**Research**: See [Topic Research](../10-research/YYYYMMDD-topic-slug.md)
```

---

## Rules

- **Preserve ALL code snippets** exactly as provided
- **Generate actionable items** (not vague suggestions)
- **Diff-first**: Always show preview before saving
- **Always update the index**: Never skip this step
- **Keep raw content reference** collapsed for space

---

## Related Commands

- `/agileflow:research:ask` - Generate research prompt for web AI
- `/agileflow:research:list` - Show research notes index
- `/agileflow:research:view` - Read specific research note

---
description: Generate/refresh full context brief for web AI tools
argument-hint: (no arguments)
---

# /agileflow:context:full

Generate or refresh the comprehensive context brief for web AI tools.

---

## Purpose

Creates `docs/context.md` with managed sections containing:
- What we're building and current focus
- Feature map and tech/tooling summary
- Key decisions (ADRs) and architecture snapshot
- Testing & CI status
- Recent progress (last 10 bus messages)
- Risks and next steps

This file is designed to be pasted into ChatGPT, Perplexity, Gemini, or Claude web to give external AI tools full project context.

---

<!-- COMPACT_SUMMARY_START -->
## Compact Summary

**Command**: `/agileflow:context:full`
**Purpose**: Generate/refresh docs/context.md with project context for web AI tools

### Critical Rules
- **ALWAYS create TodoWrite list** to track multi-step workflow
- **Diff-first**: Show changes and wait for YES/NO before ANY file writes
- **Preserve user-written content**: Only update managed sections
- **Sources**: status.json, bus/log.jsonl, epics, stories, ADRs, practices, architecture, CI, CHANGELOG

### Workflow
1. Create todo list
2. Read existing docs/context.md (if exists)
3. Gather sources
4. Generate/update managed sections
5. Show diff for review
6. Apply changes after YES
<!-- COMPACT_SUMMARY_END -->

---

## IMMEDIATE ACTIONS

Upon invocation, execute these steps:

### Step 1: Create Todo List

```xml
<invoke name="TodoWrite">
<parameter name="todos">[
  {"content": "Read existing docs/context.md", "status": "in_progress", "activeForm": "Reading context file"},
  {"content": "Gather sources (status.json, bus, epics, ADRs)", "status": "pending", "activeForm": "Gathering sources"},
  {"content": "Generate managed sections", "status": "pending", "activeForm": "Generating sections"},
  {"content": "Show diff for review", "status": "pending", "activeForm": "Showing diff"},
  {"content": "Apply changes after YES", "status": "pending", "activeForm": "Applying changes"}
]</parameter>
</invoke>
```

### Step 2: Read Existing Context

Read `docs/context.md` if it exists. Note which sections are managed (between `<!-- MANAGED_SECTION -->` and `<!-- END_MANAGED -->` markers) vs user-written.

### Step 3: Gather Sources

Read these files if they exist:
- `docs/09-agents/status.json` - Current story status
- `docs/09-agents/bus/log.jsonl` - Last 10 progress messages
- `docs/05-epics/*.md` - Epic details
- `docs/06-stories/*/*.md` - Story details
- `docs/03-decisions/*.md` - ADRs
- `docs/02-practices/*.md` - Practices
- `docs/04-architecture/*.md` - Architecture docs
- `package.json` or `pyproject.toml` - Project manifest
- `.github/workflows/*.yml` - CI config
- `CHANGELOG.md` - Recent changes

### Step 4: Generate Managed Sections

Create or update these sections:

```markdown
<!-- MANAGED_SECTION: overview -->
## What We're Building
[Project description from package.json or README]

## Current Focus
[From status.json: active epics/stories]
<!-- END_MANAGED -->

<!-- MANAGED_SECTION: features -->
## Feature Map
| Epic | Status | Stories |
|------|--------|---------|
[One line per epic from status.json]
<!-- END_MANAGED -->

<!-- MANAGED_SECTION: tech -->
## Tech Stack
- Framework: [from package.json]
- Key dependencies: [list major deps]
- Testing: [from scripts or CI]
<!-- END_MANAGED -->

<!-- MANAGED_SECTION: decisions -->
## Key Decisions (ADRs)
[List of ADRs with titles and status]
<!-- END_MANAGED -->

<!-- MANAGED_SECTION: progress -->
## Recent Progress
[Last 10 entries from bus/log.jsonl]
<!-- END_MANAGED -->

<!-- MANAGED_SECTION: next -->
## Next Steps
[Stories in READY status]
<!-- END_MANAGED -->
```

### Step 5: Show Diff

Display the changes as a diff:

```diff
- [old content]
+ [new content]
```

### Step 6: Ask for Confirmation

```xml
<invoke name="AskUserQuestion">
<parameter name="questions">[{
  "question": "Apply these changes to docs/context.md?",
  "header": "Confirm",
  "multiSelect": false,
  "options": [
    {"label": "Yes, update", "description": "Write changes to file"},
    {"label": "No, abort", "description": "Cancel without saving"}
  ]
}]</parameter>
</invoke>
```

### Step 7: Apply Changes

If YES: Write to `docs/context.md` using Edit tool, preserving user-written content.

---

## Rules

- Update ONLY managed sections (between markers)
- NEVER modify user-written content outside markers
- Diff-first: Always show changes before writing
- Create file if it doesn't exist

---

## Related Commands

- `/agileflow:context:export` - Export concise excerpt for pasting
- `/agileflow:context:note` - Add quick timestamped note
- `/agileflow:research:ask` - Generate research prompt for web AI

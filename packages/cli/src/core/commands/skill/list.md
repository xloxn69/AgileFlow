---
description: List all installed skills with their descriptions and status
argument-hint: (no arguments)
---

# /agileflow:skill:list

Display all skills installed in `.claude/skills/` with their metadata.

---

## Output Format

```
📦 Installed Skills (X total)
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

SKILL NAME              DESCRIPTION                           FILES
─────────────────────────────────────────────────────────────────────
supabase-swift          Supabase database operations          4 files
  └─ cookbook/crud-operations.md, cookbook/auth.md

ui-components           React component patterns              3 files
  └─ cookbook/create-component.md

api-integration         REST API client patterns              2 files

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
```

---

## Workflow

### STEP 1: Check for skills directory

```bash
ls -la .claude/skills/ 2>/dev/null
```

If directory doesn't exist or is empty:
```
No skills installed yet.

To create a skill, run: /agileflow:skill:create
```

### STEP 2: Scan each skill directory

For each subdirectory in `.claude/skills/`:

1. **Read SKILL.md frontmatter** to extract:
   - `name` - skill identifier
   - `description` - skill purpose

2. **Count supporting files**:
   - cookbook/*.md
   - tools/*
   - .mcp.json (if present)
   - references.md (if present)

3. **Check for MCP integration**:
   - If `.mcp.json` exists, note "MCP: ✓"

### STEP 3: Format output

```
📦 Installed Skills (3 total)
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

supabase-swift                                        MCP: ✓
  Supabase database operations for Swift apps
  └─ 4 files: cookbook/crud.md, cookbook/auth.md, references.md, .mcp.json

ui-components
  React component patterns with accessibility
  └─ 3 files: cookbook/create.md, cookbook/styling.md, references.md

api-integration
  REST API client patterns with error handling
  └─ 2 files: SKILL.md, references.md

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
```

### STEP 4: Offer next actions

```xml
<invoke name="AskUserQuestion">
<parameter name="questions">[{
  "question": "What would you like to do?",
  "header": "Skill Actions",
  "multiSelect": false,
  "options": [
    {"label": "Create new skill", "description": "Generate a new skill with research"},
    {"label": "Edit a skill", "description": "Modify an existing skill"},
    {"label": "Delete a skill", "description": "Remove a skill"},
    {"label": "Test a skill", "description": "Verify a skill works correctly"},
    {"label": "Done", "description": "Exit skill management"}
  ]
}]</parameter>
</invoke>
```

---

## Skill Metadata Parsing

**SKILL.md Frontmatter Example:**
```yaml
---
name: supabase-swift
description: Use when building Swift apps with Supabase database operations
---
```

**Parse with:**
```bash
head -10 .claude/skills/<skill>/SKILL.md | grep -E "^(name|description):"
```

---

## Error Handling

### No Skills Directory
```
📦 No skills installed yet.

Skills are stored in .claude/skills/ and can be created with:
  /agileflow:skill:create

This will research best practices and generate a contextual skill.
```

### Invalid Skill (Missing SKILL.md)
Skip directories without SKILL.md and note:
```
⚠️ Skipped: <dirname>/ (missing SKILL.md)
```

### Corrupted Frontmatter
If frontmatter can't be parsed:
```
⚠️ <skill>: Could not parse frontmatter
```

---

## Usage

```bash
# List all installed skills
/agileflow:skill:list
```

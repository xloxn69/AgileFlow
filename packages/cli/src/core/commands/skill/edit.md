---
description: Edit an existing skill's SKILL.md, cookbook entries, or references
argument-hint: [SKILL_NAME] (optional)
---

# /agileflow:skill:edit

Modify an existing skill in `.claude/skills/`.

---

## Workflow

### STEP 1: Select skill to edit

If SKILL_NAME not provided, list available skills:

```bash
ls -d .claude/skills/*/ 2>/dev/null | xargs -I {} basename {}
```

Then ask user:

```xml
<invoke name="AskUserQuestion">
<parameter name="questions">[{
  "question": "Which skill would you like to edit?",
  "header": "Select Skill",
  "multiSelect": false,
  "options": [
    {"label": "<skill-1>", "description": "<description from frontmatter>"},
    {"label": "<skill-2>", "description": "<description from frontmatter>"},
    {"label": "<skill-3>", "description": "<description from frontmatter>"}
  ]
}]</parameter>
</invoke>
```

### STEP 2: Show skill structure

Display current skill contents:

```
📝 Editing: supabase-swift
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Files:
  1. SKILL.md (main skill file)
  2. references.md (documentation links)
  3. cookbook/crud-operations.md
  4. cookbook/authentication.md
  5. .mcp.json (MCP configuration)

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
```

### STEP 3: Ask what to edit

```xml
<invoke name="AskUserQuestion">
<parameter name="questions">[{
  "question": "What would you like to modify?",
  "header": "Edit Target",
  "multiSelect": false,
  "options": [
    {"label": "SKILL.md", "description": "Edit main skill instructions"},
    {"label": "references.md", "description": "Update documentation links"},
    {"label": "Cookbook entry", "description": "Edit a specific workflow"},
    {"label": "Add new cookbook", "description": "Create a new workflow"},
    {"label": "MCP configuration", "description": "Modify MCP server settings"},
    {"label": "Rename skill", "description": "Change skill name and folder"}
  ]
}]</parameter>
</invoke>
```

### STEP 4: Read current content

Read the selected file:

```bash
cat .claude/skills/<skill>/<file>
```

### STEP 5: Ask for changes

```xml
<invoke name="AskUserQuestion">
<parameter name="questions">[{
  "question": "How would you like to modify this file?",
  "header": "Edit Mode",
  "multiSelect": false,
  "options": [
    {"label": "Describe changes", "description": "Tell me what to change and I'll update it"},
    {"label": "Add content", "description": "Append new sections or examples"},
    {"label": "Replace section", "description": "Rewrite a specific section"},
    {"label": "Full rewrite", "description": "Regenerate with research (Recommended)"},
    {"label": "Cancel", "description": "Return without changes"}
  ]
}]</parameter>
</invoke>
```

### STEP 6: Apply changes

Based on user's choice:

**For "Describe changes":**
- Read current file
- Apply user's described modifications
- Show diff preview
- Confirm with YES/NO

**For "Full rewrite":**
- Enter plan mode to research
- Gather updated web docs, local docs, codebase patterns
- Regenerate file with new research
- Show diff preview
- Confirm with YES/NO

### STEP 7: Show diff and confirm

```
📝 Changes to SKILL.md:
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

- old line
+ new line

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
```

```xml
<invoke name="AskUserQuestion">
<parameter name="questions">[{
  "question": "Apply these changes?",
  "header": "Confirm",
  "multiSelect": false,
  "options": [
    {"label": "Yes, save changes", "description": "Write the updated file"},
    {"label": "No, discard", "description": "Cancel without saving"},
    {"label": "Edit more", "description": "Make additional changes first"}
  ]
}]</parameter>
</invoke>
```

### STEP 8: Write changes

If confirmed:
1. Write updated file
2. Show success message
3. Offer next actions

---

## Special Edits

### Rename Skill

1. Get new name from user
2. Validate: letters, numbers, hyphens only
3. Create new directory: `.claude/skills/<new-name>/`
4. Copy all files
5. Update `name:` in SKILL.md frontmatter
6. Delete old directory
7. Confirm completion

### Add Cookbook Entry

1. Ask for use case name
2. Create `cookbook/<use-case>.md` from template
3. Update SKILL.md to reference new cookbook
4. Show diff and confirm

---

## Cookbook Template

```markdown
# <Use Case Title>

<Brief description of this workflow.>

## Prerequisites

- <Prerequisite 1>
- <Prerequisite 2>

## Instructions

1. **<Step 1>**:
   <Details>

2. **<Step 2>**:
   ```<language>
   <code example>
   ```

3. **<Step 3>**:
   <Details>

## Example

**Input**: <sample>
**Output**: <result>

## Troubleshooting

- **<Problem>**: <Solution>
```

---

## Error Handling

### Skill Not Found
```
❌ Skill "<name>" not found.

Available skills:
  - supabase-swift
  - ui-components

Use /agileflow:skill:list to see all skills.
```

### No Skills Installed
```
❌ No skills installed yet.

Create a skill first: /agileflow:skill:create
```

---

## Usage

```bash
# Interactive mode
/agileflow:skill:edit

# Edit specific skill
/agileflow:skill:edit supabase-swift
```

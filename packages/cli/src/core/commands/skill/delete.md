---
description: Remove an installed skill from .claude/skills/
argument-hint: [SKILL_NAME] (optional)
---

# /agileflow:skill:delete

Remove a skill from `.claude/skills/`.

---

## Workflow

### STEP 1: Select skill to delete

If SKILL_NAME not provided, list available skills:

```bash
ls -d .claude/skills/*/ 2>/dev/null | xargs -I {} basename {}
```

Then ask user:

```xml
<invoke name="AskUserQuestion">
<parameter name="questions">[{
  "question": "Which skill would you like to delete?",
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

### STEP 2: Show skill contents

Display what will be deleted:

```
⚠️  About to delete: supabase-swift
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

This will permanently remove:
  .claude/skills/supabase-swift/
  ├── SKILL.md
  ├── references.md
  ├── cookbook/
  │   ├── crud-operations.md
  │   └── authentication.md
  └── .mcp.json

Total: 5 files in 2 directories

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
```

### STEP 3: Confirm deletion

```xml
<invoke name="AskUserQuestion">
<parameter name="questions">[{
  "question": "Are you sure you want to delete this skill? This cannot be undone.",
  "header": "Confirm Delete",
  "multiSelect": false,
  "options": [
    {"label": "Yes, delete permanently", "description": "Remove the skill and all its files"},
    {"label": "No, keep it", "description": "Cancel and return"},
    {"label": "Export first", "description": "Save a backup before deleting"}
  ]
}]</parameter>
</invoke>
```

### STEP 4: Handle export (if requested)

If user chose "Export first":

1. Create backup directory: `.claude/skills-backup/`
2. Copy skill to backup with timestamp:
   ```bash
   cp -r .claude/skills/<skill> .claude/skills-backup/<skill>-$(date +%Y%m%d-%H%M%S)/
   ```
3. Show backup location
4. Return to confirmation

### STEP 5: Delete skill

```bash
rm -rf .claude/skills/<skill>/
```

### STEP 6: Confirm deletion

```
✅ Deleted: supabase-swift

The skill has been permanently removed from .claude/skills/
```

### STEP 7: Offer next actions

```xml
<invoke name="AskUserQuestion">
<parameter name="questions">[{
  "question": "What would you like to do next?",
  "header": "Next Action",
  "multiSelect": false,
  "options": [
    {"label": "Delete another skill", "description": "Remove more skills"},
    {"label": "Create new skill", "description": "Generate a replacement skill"},
    {"label": "List remaining skills", "description": "See what's still installed"},
    {"label": "Done", "description": "Exit skill management"}
  ]
}]</parameter>
</invoke>
```

---

## Backup Location

Backups are stored in:
```
.claude/skills-backup/<skill>-<timestamp>/
```

Example:
```
.claude/skills-backup/supabase-swift-20251227-143052/
├── SKILL.md
├── references.md
├── cookbook/
└── .mcp.json
```

---

## Error Handling

### Skill Not Found
```
❌ Skill "<name>" not found.

Available skills:
  - ui-components
  - api-integration

Use /agileflow:skill:list to see all skills.
```

### No Skills Installed
```
❌ No skills to delete.

No skills are currently installed in .claude/skills/
```

### Delete Failed
```
❌ Failed to delete skill: <error message>

The skill directory may be in use or have permission issues.
Try manually: rm -rf .claude/skills/<skill>/
```

---

## Safety Features

1. **Always confirm** - Never delete without explicit confirmation
2. **Show contents** - Display exactly what will be removed
3. **Export option** - Allow backup before deletion
4. **No batch delete** - One skill at a time for safety

---

## Usage

```bash
# Interactive mode
/agileflow:skill:delete

# Delete specific skill
/agileflow:skill:delete supabase-swift
```

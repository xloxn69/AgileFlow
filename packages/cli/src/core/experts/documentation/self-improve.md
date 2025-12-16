---
description: Update documentation expertise after making changes
argument-hint: [optional context about what changed]
variables:
  EXPERTISE_FILE: packages/cli/src/core/experts/documentation/expertise.yaml
---

# Documentation Expert - Self-Improve

Update your expertise file after documentation changes.

## Workflow

### Step 1: Read Current Expertise
Load `{{EXPERTISE_FILE}}`.

### Step 2: Analyze What Changed
```bash
git diff HEAD~1 --name-only | grep -E "(README|docs|\.md|api)"
```

### Step 3: Update Expertise

**Update `files` if:** New docs added, docs relocated
**Update `relationships` if:** New doc types, structure changed
**Update `patterns` if:** New documentation patterns
**Update `conventions` if:** Style guidelines changed

### Step 4: Add Learnings Entry
```yaml
learnings:
  - date: 2025-12-16
    insight: "Added [doc type] for [purpose]"
    files_affected: [list]
    context: "{{argument}}"
```

### Step 5: Validate and Save
- [ ] All doc paths exist
- [ ] `last_updated` current
- [ ] No duplicates

## Context

{{argument}}

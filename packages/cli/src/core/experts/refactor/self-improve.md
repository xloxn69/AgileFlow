---
description: Update refactor expertise after making changes
argument-hint: [optional context about what changed]
variables:
  EXPERTISE_FILE: packages/cli/src/core/experts/refactor/expertise.yaml
---

# Refactor Expert - Self-Improve

Update your expertise file after refactoring changes.

## Workflow

### Step 1: Read Current Expertise
Load `{{EXPERTISE_FILE}}`.

### Step 2: Analyze What Changed
```bash
git diff HEAD~1 --stat
```

### Step 3: Update Expertise

**Update `files` if:** New quality configs, test locations changed
**Update `relationships` if:** New code smell patterns discovered
**Update `patterns` if:** New refactoring patterns used
**Update `conventions` if:** Refactoring rules changed

### Step 4: Add Learnings Entry
```yaml
learnings:
  - date: 2025-12-16
    insight: "Refactored [what] using [pattern]"
    files_affected: [list]
    context: "{{argument}}"
```

### Step 5: Validate and Save
- [ ] All paths exist
- [ ] `last_updated` current
- [ ] No duplicates

## Context

{{argument}}

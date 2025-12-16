---
description: Update accessibility expertise after making changes
argument-hint: [optional context about what changed]
variables:
  EXPERTISE_FILE: packages/cli/src/core/experts/accessibility/expertise.yaml
---

# Accessibility Expert - Self-Improve

Update your expertise file after accessibility changes.

## Workflow

### Step 1: Read Current Expertise
Load `{{EXPERTISE_FILE}}`.

### Step 2: Analyze What Changed
```bash
git diff HEAD~1 --name-only | grep -E "(component|a11y|aria|accessibility)"
```

### Step 3: Update Expertise

**Update `files` if:** New components, a11y configs added
**Update `relationships` if:** New component types with a11y requirements
**Update `patterns` if:** New accessibility patterns
**Update `wcag_checklist` if:** Compliance status changed

### Step 4: Add Learnings Entry
```yaml
learnings:
  - date: 2025-12-16
    insight: "Added [a11y feature] for [WCAG criterion]"
    files_affected: [list]
    context: "{{argument}}"
```

### Step 5: Validate and Save
- [ ] All paths exist
- [ ] `last_updated` current
- [ ] No duplicates

## Context

{{argument}}

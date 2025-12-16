---
description: Update {{DOMAIN}} expertise after making changes
argument-hint: [optional context about what changed]
variables:
  EXPERTISE_FILE: packages/cli/src/core/experts/{{DOMAIN}}/expertise.yaml
---

# {{DOMAIN_TITLE}} Expert - Self-Improve

You are updating your mental model (expertise file) to reflect changes in the codebase. This keeps your expertise accurate and useful for future tasks.

## CRITICAL: Self-Improve Workflow

### Step 1: Read Current Expertise
Load your expertise file at `{{EXPERTISE_FILE}}`.

Understand what you currently know about:
- File locations
- Relationships
- Patterns
- Conventions

### Step 2: Analyze What Changed
Identify changes using one of these methods:

**If git diff available:**
```bash
git diff HEAD~1 --name-only | grep -E "{{DOMAIN_PATTERN}}"
```

**If context provided:**
Use the argument/context to understand what changed.

**If neither:**
Compare expertise file against actual codebase state.

### Step 3: Update Expertise

**Update `files` section if:**
- New files were added to the domain
- Files were moved or renamed
- Key exports changed
- Purpose or conventions changed

**Update `relationships` section if:**
- New relationships were created
- Existing relationships changed
- Relationships were removed

**Update `patterns` section if:**
- New patterns were introduced
- Existing patterns were modified
- Better patterns discovered

**Update `conventions` section if:**
- New conventions established
- Existing conventions changed
- Conventions deprecated

**ALWAYS add to `learnings` section:**
```yaml
learnings:
  - date: {{TODAY}}
    insight: "Brief description of what was learned"
    files_affected: [list, of, files]
    context: "What triggered this learning (story ID, task, etc.)"
```

### Step 4: Validate Updated Model
After updating, verify:
1. All file paths in expertise still exist
2. Relationships match actual code structure
3. Patterns are still used as described
4. No contradictions in the expertise file

### Step 5: Write Updated Expertise
Save the updated expertise.yaml file.

## Rules for Self-Improve

### DO:
- Add only verified information
- Remove stale/incorrect entries
- Keep entries focused on {{DOMAIN}} domain only
- Use specific file paths, not vague descriptions
- Date all learnings entries

### DON'T:
- Add speculative information
- Keep outdated entries "just in case"
- Add knowledge from other domains
- Make expertise file too large (keep it focused)
- Forget to update last_updated timestamp

## Quality Checklist

Before saving:
- [ ] `last_updated` timestamp is current
- [ ] All file paths verified to exist
- [ ] New learnings entry added with today's date
- [ ] No duplicate entries
- [ ] Expertise stays under 200 lines (focused)

## Context

{{argument}}

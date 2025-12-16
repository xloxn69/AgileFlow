---
description: Update testing expertise after making changes
argument-hint: [optional context about what changed]
variables:
  EXPERTISE_FILE: packages/cli/src/core/experts/testing/expertise.yaml
---

# Testing Expert - Self-Improve

You are updating your mental model (expertise file) to reflect changes in the codebase. This keeps your expertise accurate and useful for future tasks.

## CRITICAL: Self-Improve Workflow

### Step 1: Read Current Expertise
Load your expertise file at `{{EXPERTISE_FILE}}`.

Understand what you currently know about:
- Test file locations
- Testing frameworks
- Patterns and fixtures
- Coverage conventions

### Step 2: Analyze What Changed
Identify changes using one of these methods:

**If git diff available:**
```bash
git diff HEAD~1 --name-only | grep -E "(test|spec|__tests__|jest|vitest|playwright|cypress)"
```

**If context provided:**
Use the argument/context to understand what changed.

**If neither:**
Compare expertise file against actual codebase state.

### Step 3: Update Expertise

**Update `files` section if:**
- New test directories added
- Test files relocated
- New test config files created
- Framework configuration changed

**Update `relationships` section if:**
- New test types introduced (unit, integration, e2e)
- New framework added
- Test organization changed

**Update `patterns` section if:**
- New testing patterns introduced
- Better mocking approaches discovered
- Fixture patterns changed

**Update `conventions` section if:**
- Naming conventions changed
- Coverage thresholds updated
- New testing rules established

### Step 4: Add Learnings Entry
**ALWAYS** add a new learnings entry:

```yaml
learnings:
  - date: 2025-12-16
    insight: "Brief description of what was learned"
    files_affected:
      - path/to/test1
      - path/to/test2
    context: "Feature: {{argument}}"
```

### Step 5: Validate Updated Expertise
Before saving:
- [ ] All test paths exist
- [ ] Framework configs are accurate
- [ ] `last_updated` is current
- [ ] No duplicate entries
- [ ] File stays focused (<200 lines)

### Step 6: Save Expertise
Write the updated expertise.yaml file.

## Testing-Specific Updates

**After adding new tests:**
- Update test_files if in new location
- Note any new patterns used
- Update coverage info if changed

**After framework changes:**
- Update config file locations
- Update relationships for new framework
- Add pattern notes

**After fixing flaky tests:**
- Document the fix in learnings
- Note pattern to avoid in conventions

## Context

{{argument}}

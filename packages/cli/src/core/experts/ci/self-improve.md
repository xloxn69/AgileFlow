---
description: Update CI expertise after making changes
argument-hint: [optional context about what changed]
variables:
  EXPERTISE_FILE: packages/cli/src/core/experts/ci/expertise.yaml
---

# CI Expert - Self-Improve

You are updating your mental model (expertise file) to reflect changes in the codebase. This keeps your expertise accurate and useful for future tasks.

## CRITICAL: Self-Improve Workflow

### Step 1: Read Current Expertise
Load your expertise file at `{{EXPERTISE_FILE}}`.

Understand what you currently know about:
- Workflow file locations
- CI platform and jobs
- Caching patterns
- Quality tools

### Step 2: Analyze What Changed
Identify changes using one of these methods:

**If git diff available:**
```bash
git diff HEAD~1 --name-only | grep -E "(workflow|ci|\.github|gitlab|jenkins|eslint|prettier|tsconfig)"
```

**If context provided:**
Use the argument/context to understand what changed.

**If neither:**
Compare expertise file against actual codebase state.

### Step 3: Update Expertise

**Update `files` section if:**
- New workflows added
- Config files relocated
- New quality tools configured

**Update `relationships` section if:**
- New jobs added to workflows
- Job triggers changed
- New tools integrated

**Update `patterns` section if:**
- New caching strategies
- New optimization patterns
- Better workflow structures

**Update `conventions` section if:**
- Build time targets changed
- Required checks updated
- New quality standards

### Step 4: Add Learnings Entry
**ALWAYS** add a new learnings entry:

```yaml
learnings:
  - date: 2025-12-16
    insight: "Brief description of what was learned"
    files_affected:
      - .github/workflows/ci.yml
    context: "Feature: {{argument}}"
```

### Step 5: Validate Updated Expertise
Before saving:
- [ ] All workflow paths exist
- [ ] Job configurations accurate
- [ ] `last_updated` is current
- [ ] No duplicate entries
- [ ] File stays focused (<200 lines)

### Step 6: Save Expertise
Write the updated expertise.yaml file.

## CI-Specific Updates

**After adding new workflow:**
- Add to workflows files list
- Document triggers and jobs
- Note any new patterns

**After optimizing CI:**
- Update patterns with optimization
- Document time savings in learnings
- Update conventions if thresholds changed

**After fixing flaky CI:**
- Document root cause in learnings
- Add prevention pattern to conventions

## Context

{{argument}}

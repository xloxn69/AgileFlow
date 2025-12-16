---
description: Update performance expertise after making changes
argument-hint: [optional context about what changed]
variables:
  EXPERTISE_FILE: packages/cli/src/core/experts/performance/expertise.yaml
---

# Performance Expert - Self-Improve

Update your expertise file after performance changes.

## Workflow

### Step 1: Read Current Expertise
Load `{{EXPERTISE_FILE}}`.

### Step 2: Analyze What Changed
```bash
git diff HEAD~1 --name-only | grep -E "(benchmark|perf|cache|optim)"
```

### Step 3: Update Expertise

**Update `files` if:** New benchmarks, profiling configs added
**Update `relationships` if:** New metrics, targets changed
**Update `patterns` if:** New optimization patterns
**Update `bottlenecks` if:** New bottlenecks discovered/fixed

### Step 4: Add Learnings Entry
```yaml
learnings:
  - date: 2025-12-16
    insight: "Optimized [what] - [before] → [after]"
    files_affected: [list]
    context: "{{argument}}"
```

### Step 5: Validate and Save
- [ ] All paths exist
- [ ] `last_updated` current
- [ ] No duplicates

## Context

{{argument}}

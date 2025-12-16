---
description: Plan, build, and improve performance with expertise-driven workflow
argument-hint: <performance task description>
variables:
  EXPERTISE_FILE: packages/cli/src/core/experts/performance/expertise.yaml
---

# Performance Expert: Plan → Build → Self-Improve

## Step 1: PLAN

### 1.1 Load Expertise
Read `{{EXPERTISE_FILE}}` - know targets, bottlenecks, patterns.

### 1.2 Profile First
```bash
# Measure baseline performance
npm run benchmark
```

### 1.3 Create Plan
```markdown
## Performance Plan
- Bottleneck identified: [what]
- Current metric: [value]
- Target metric: [value]
- Optimization approach: [pattern]
```

## Step 2: BUILD

### 2.1 Execute Plan
- Apply optimization
- Verify correctness
- Measure improvement

### 2.2 Capture Changes
```bash
git diff --name-only
# Run benchmark again
npm run benchmark
```

### 2.3 Validate
- Behavior unchanged
- Performance improved
- No regressions

## Step 3: SELF-IMPROVE

### 3.1 Update Expertise
- Document before/after metrics
- Note successful patterns
- Update bottleneck list

### 3.2 Save
Update `{{EXPERTISE_FILE}}` with learnings.

## Performance Request

{{argument}}

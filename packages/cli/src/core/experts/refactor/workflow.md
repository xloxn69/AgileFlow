---
description: Plan, build, and improve refactoring with expertise-driven workflow
argument-hint: <refactoring task description>
variables:
  EXPERTISE_FILE: packages/cli/src/core/experts/refactor/expertise.yaml
---

# Refactor Expert: Plan → Build → Self-Improve

## Step 1: PLAN

### 1.1 Load Expertise
Read `{{EXPERTISE_FILE}}` - know code smells, patterns, conventions.

### 1.2 Validate
- Run tests first (must pass before refactoring)
- Measure current complexity

### 1.3 Create Plan
```markdown
## Refactoring Plan
- Code smell identified: [type]
- Refactoring pattern: [name]
- Files affected: [list]
- Risk level: [low/medium/high]
```

## Step 2: BUILD

### 2.1 Execute Plan
- Apply refactoring pattern
- Keep tests green throughout
- Make atomic commits

### 2.2 Capture Changes
```bash
git diff --stat
```

### 2.3 Validate
- All tests pass
- Complexity reduced
- No behavior change

## Step 3: SELF-IMPROVE

### 3.1 Update Expertise
- Note new code smells found
- Document successful patterns
- Add learnings

### 3.2 Save
Update `{{EXPERTISE_FILE}}` with learnings.

## Refactoring Request

{{argument}}

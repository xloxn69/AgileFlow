---
description: Plan, build, and improve documentation with expertise-driven workflow
argument-hint: <documentation task description>
variables:
  EXPERTISE_FILE: packages/cli/src/core/experts/documentation/expertise.yaml
---

# Documentation Expert: Plan → Build → Self-Improve

## Step 1: PLAN

### 1.1 Load Expertise
Read `{{EXPERTISE_FILE}}` - know doc structure, conventions, patterns.

### 1.2 Validate
Check documentation locations exist.

### 1.3 Create Plan
```markdown
## Documentation Plan
- Files to create/update: [list]
- Pattern to follow: [from expertise]
- Examples needed: [list]
```

## Step 2: BUILD

### 2.1 Execute Plan
- Write clear, concise documentation
- Include code examples
- Follow existing patterns

### 2.2 Capture Changes
```bash
git diff --name-only | grep -E "(\.md|docs)"
```

### 2.3 Validate
- Links work
- Examples run
- Format consistent

## Step 3: SELF-IMPROVE

### 3.1 Update Expertise
- Add new doc locations
- Note new patterns
- Add learnings

### 3.2 Save
Update `{{EXPERTISE_FILE}}` with learnings.

## Documentation Request

{{argument}}

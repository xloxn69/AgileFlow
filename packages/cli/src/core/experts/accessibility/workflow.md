---
description: Plan, build, and improve accessibility with expertise-driven workflow
argument-hint: <accessibility task description>
variables:
  EXPERTISE_FILE: packages/cli/src/core/experts/accessibility/expertise.yaml
---

# Accessibility Expert: Plan → Build → Self-Improve

## Step 1: PLAN

### 1.1 Load Expertise
Read `{{EXPERTISE_FILE}}` - know WCAG requirements, ARIA patterns.

### 1.2 Audit First
```bash
# Run accessibility audit
npx axe --dir src/
```

### 1.3 Create Plan
```markdown
## Accessibility Plan
- Issue identified: [WCAG criterion]
- Component affected: [name]
- Fix approach: [pattern]
- Testing: [screen reader, keyboard]
```

## Step 2: BUILD

### 2.1 Execute Plan
- Add ARIA attributes
- Implement keyboard navigation
- Ensure color contrast

### 2.2 Capture Changes
```bash
git diff --name-only | grep -E "(component|tsx)"
```

### 2.3 Validate
- Axe audit passes
- Keyboard navigation works
- Screen reader announces correctly

## Step 3: SELF-IMPROVE

### 3.1 Update Expertise
- Update component requirements
- Note new ARIA patterns
- Add learnings

### 3.2 Save
Update `{{EXPERTISE_FILE}}` with learnings.

## Accessibility Request

{{argument}}

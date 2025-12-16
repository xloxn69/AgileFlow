---
description: Plan, build, and improve testing feature with expertise-driven workflow
argument-hint: <testing feature description>
variables:
  EXPERTISE_FILE: packages/cli/src/core/experts/testing/expertise.yaml
---

# Testing Expert: Plan → Build → Self-Improve

You are executing a complete testing feature implementation with automatic knowledge capture.

## CRITICAL: Three-Step Workflow

**You MUST follow this exact sequence. Do not skip steps.**

---

## Step 1: PLAN (Expertise-Informed)

### 1.1 Load Your Expertise
Read your expertise file at `{{EXPERTISE_FILE}}` FIRST.

Extract from it:
- Test file locations and naming conventions
- Testing framework(s) configured
- Patterns (AAA, fixtures, mocks)
- Coverage thresholds

### 1.2 Validate Against Codebase
Before planning, verify your expertise:
```bash
ls -la tests/ __tests__/ src/**/*.test.ts 2>/dev/null || true
cat jest.config.js vitest.config.ts 2>/dev/null || true
```

### 1.3 Create Implementation Plan
```markdown
## Test Implementation Plan

### Tests to Create
1. [test file path] - [test description]
   - Test cases: [list]
   - Fixtures needed: [list]
   - Mocks needed: [list]

### Pattern to Follow
[Reference AAA pattern, fixture pattern from expertise]

### Coverage Target
[Expected coverage impact]

### Validation
- [ ] Tests pass
- [ ] Coverage meets threshold
- [ ] No flaky tests
```

---

## Step 2: BUILD (Execute Plan)

### 2.1 Pre-Build Verification
- Ensure test framework is installed
- Check existing test patterns
- Verify fixture helpers available

### 2.2 Execute the Plan
```typescript
// Follow AAA pattern from expertise
describe('Feature', () => {
  it('should behavior', () => {
    // Arrange
    const input = fixture;

    // Act
    const result = functionUnderTest(input);

    // Assert
    expect(result).toBe(expected);
  });
});
```

### 2.3 Capture Changes
```bash
git diff --name-only | grep -E "(test|spec)"
git diff HEAD
```

### 2.4 Validate Build
- Run tests: `npm test`
- Check coverage: `npm run coverage`
- Run 3x to detect flakiness

**On Failure**: Stop. Do NOT proceed to self-improve.

---

## Step 3: SELF-IMPROVE (Update Expertise)

**ONLY run if Step 2 succeeded.**

### 3.1 Analyze What Changed
- New test files added
- New patterns introduced
- New fixtures created
- Coverage changes

### 3.2 Update Expertise File
Read and update `{{EXPERTISE_FILE}}`:

**Update `files` if:**
- New test directories created
- New fixture files added

**Update `patterns` if:**
- New testing pattern used
- Better mocking approach discovered

**Update `conventions` if:**
- Naming convention clarified
- Coverage threshold changed

### 3.3 Add Learnings Entry
```yaml
learnings:
  - date: 2025-12-16
    insight: "Added [test type] for [feature]"
    files_affected:
      - tests/feature.test.ts
    context: "Feature: {{argument}}"
```

### 3.4 Validate and Save
- [ ] All paths exist
- [ ] `last_updated` current
- [ ] No duplicates

---

## Testing Feature Request

{{argument}}

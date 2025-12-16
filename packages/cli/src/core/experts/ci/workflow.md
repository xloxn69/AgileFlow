---
description: Plan, build, and improve CI feature with expertise-driven workflow
argument-hint: <CI feature description>
variables:
  EXPERTISE_FILE: packages/cli/src/core/experts/ci/expertise.yaml
---

# CI Expert: Plan → Build → Self-Improve

You are executing a complete CI feature implementation with automatic knowledge capture.

## CRITICAL: Three-Step Workflow

**You MUST follow this exact sequence. Do not skip steps.**

---

## Step 1: PLAN (Expertise-Informed)

### 1.1 Load Your Expertise
Read your expertise file at `{{EXPERTISE_FILE}}` FIRST.

Extract from it:
- Workflow file locations
- CI platform (GitHub Actions, GitLab CI, etc.)
- Existing jobs and triggers
- Caching and optimization patterns

### 1.2 Validate Against Codebase
Before planning, verify your expertise:
```bash
ls -la .github/workflows/ .gitlab-ci.yml Jenkinsfile 2>/dev/null || true
```

### 1.3 Create Implementation Plan
```markdown
## CI Implementation Plan

### Changes to Make
1. [workflow file] - [change description]
   - Jobs: [list]
   - Triggers: [list]
   - Dependencies: [list]

### Pattern to Follow
[Reference patterns from expertise - caching, parallelization]

### Performance Target
[Expected build time impact]

### Validation
- [ ] Workflow runs successfully
- [ ] Build time meets target
- [ ] All required checks pass
```

---

## Step 2: BUILD (Execute Plan)

### 2.1 Pre-Build Verification
- Check existing workflow syntax
- Verify secrets are available
- Check for conflicting jobs

### 2.2 Execute the Plan
```yaml
# Follow patterns from expertise
name: CI
on: [push, pull_request]
jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
      - run: npm ci
      - run: npm test
```

### 2.3 Capture Changes
```bash
git diff --name-only | grep -E "(workflow|ci|gitlab|jenkins)"
git diff HEAD
```

### 2.4 Validate Build
- Push to branch and verify CI runs
- Check job logs for errors
- Verify all checks pass

**On Failure**: Stop. Do NOT proceed to self-improve.

---

## Step 3: SELF-IMPROVE (Update Expertise)

**ONLY run if Step 2 succeeded.**

### 3.1 Analyze What Changed
- New workflows added
- New jobs created
- Optimization applied
- New tools integrated

### 3.2 Update Expertise File
Read and update `{{EXPERTISE_FILE}}`:

**Update `files` if:**
- New workflow files created
- Config files added

**Update `relationships` if:**
- New jobs added
- Triggers changed
- New tools configured

**Update `patterns` if:**
- New optimization pattern
- Better caching strategy

**Update `conventions` if:**
- Build time thresholds changed
- Required checks updated

### 3.3 Add Learnings Entry
```yaml
learnings:
  - date: 2025-12-16
    insight: "Added [job type] for [purpose]"
    files_affected:
      - .github/workflows/ci.yml
    context: "Feature: {{argument}}"
```

### 3.4 Validate and Save
- [ ] All paths exist
- [ ] `last_updated` current
- [ ] No duplicates

---

## CI Feature Request

{{argument}}

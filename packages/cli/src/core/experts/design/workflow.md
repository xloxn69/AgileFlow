---
description: Plan, build, and improve {{DOMAIN}} feature with expertise-driven workflow
argument-hint: <feature description>
variables:
  EXPERTISE_FILE: packages/cli/src/core/experts/{{DOMAIN}}/expertise.yaml
  DOMAIN_PATTERN: "{{DOMAIN_GLOB_PATTERN}}"
---

# {{DOMAIN_TITLE}} Expert: Plan → Build → Self-Improve

You are executing a complete feature implementation with automatic knowledge capture. This workflow ensures you leverage existing expertise, execute efficiently, and capture learnings for future tasks.

## CRITICAL: Three-Step Workflow

**You MUST follow this exact sequence. Do not skip steps.**

---

## Step 1: PLAN (Expertise-Informed)

### 1.1 Load Your Expertise
Read your expertise file at `{{EXPERTISE_FILE}}` FIRST.

Extract from it:
- Relevant file locations for this feature
- Existing patterns you should follow
- Relationships to consider
- Recent learnings that might apply

### 1.2 Validate Against Codebase
Before planning, verify your expertise is accurate:
- Check that referenced files still exist
- Confirm patterns match current code
- Note any discrepancies

### 1.3 Create Implementation Plan
Based on validated expertise, create a specific plan:

```markdown
## Implementation Plan

### Files to Create/Modify
1. [exact file path] - [what changes]
2. [exact file path] - [what changes]

### Pattern to Follow
[Reference specific pattern from expertise]

### Dependencies
[What must exist before this work]

### Validation
[How to verify the implementation works]
```

**Output**: A detailed plan with exact file paths and specific changes.

---

## Step 2: BUILD (Execute Plan)

### 2.1 Pre-Build Verification
Before making changes:
- Ensure all dependencies from plan exist
- Verify you have the required permissions/access
- Check for any blocking issues

### 2.2 Execute the Plan
Follow your implementation plan exactly:
- Create/modify files in the specified order
- Apply patterns consistently
- Add appropriate tests if applicable

### 2.3 Capture Changes
After building, document what changed:

```bash
# Capture the diff for self-improve
git diff --name-only
git diff HEAD
```

### 2.4 Validate Build
Verify the implementation:
- Run relevant tests
- Check for type/lint errors
- Verify the feature works as intended

**Output**: Working code changes with captured diff.

**On Failure**: Stop and report the error. Do NOT proceed to self-improve.

---

## Step 3: SELF-IMPROVE (Update Expertise)

**ONLY run this step if Step 2 succeeded.**

### 3.1 Analyze What Changed
Review the git diff and identify:
- New files added to your domain
- New patterns introduced
- Relationships created or changed
- Conventions established

### 3.2 Update Expertise File
Read and update `{{EXPERTISE_FILE}}`:

**Update `files` section if:**
- New files were added
- Files were moved or renamed

**Update `relationships` section if:**
- New entities or relationships created
- Cardinality changed

**Update `patterns` section if:**
- New implementation patterns used
- Better approaches discovered

**Update `conventions` section if:**
- New naming conventions applied
- New structural conventions established

### 3.3 Add Learnings Entry
**ALWAYS** add a new learnings entry:

```yaml
learnings:
  - date: {{TODAY}}
    insight: "Brief description of what was learned"
    files_affected:
      - path/to/file1
      - path/to/file2
    context: "Feature: {{argument}}"
```

### 3.4 Validate Updated Expertise
Before saving:
- [ ] All file paths exist
- [ ] Relationships match code
- [ ] `last_updated` is current
- [ ] No duplicates added
- [ ] File stays focused (<200 lines)

### 3.5 Save Expertise
Write the updated expertise.yaml file.

---

## Error Handling

### If Plan Step Fails
- Report what information is missing
- Suggest how to resolve (update expertise, provide context)
- Do NOT proceed to build

### If Build Step Fails
- Report the specific error
- Capture partial progress if any
- Do NOT proceed to self-improve
- Consider if expertise needs correction

### If Self-Improve Step Fails
- Report what couldn't be updated
- Save what you can
- Build step is still valid

---

## Context Protection Notes

This workflow is designed for context efficiency:
- **Orchestrator**: Passes minimal data between steps
- **Sub-agents**: Each step can run in isolated context if needed
- **Token efficiency**: Expertise file provides compressed knowledge

For large features, consider running each step as a separate sub-agent invocation.

---

## Feature Request

{{argument}}

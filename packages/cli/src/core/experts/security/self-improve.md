---
description: Update security expertise after making changes
argument-hint: [optional context about what changed]
variables:
  EXPERTISE_FILE: packages/cli/src/core/experts/security/expertise.yaml
---

# Security Expert - Self-Improve

You are updating your mental model (expertise file) to reflect changes in the codebase. This keeps your expertise accurate and useful for future tasks.

## CRITICAL: Self-Improve Workflow

### Step 1: Read Current Expertise
Load your expertise file at `{{EXPERTISE_FILE}}`.

Understand what you currently know about:
- Authentication implementation
- Authorization patterns
- Security configurations
- OWASP awareness

### Step 2: Analyze What Changed
Identify changes using one of these methods:

**If git diff available:**
```bash
git diff HEAD~1 --name-only | grep -E "(auth|security|middleware|jwt|session|crypt|valid)"
```

**If context provided:**
Use the argument/context to understand what changed.

**If neither:**
Compare expertise file against actual codebase state.

### Step 3: Update Expertise

**Update `files` section if:**
- New auth files created
- Security middleware added
- Config files relocated

**Update `relationships` section if:**
- New auth patterns introduced
- Authorization flow changed
- Validation approach updated

**Update `patterns` section if:**
- New security patterns implemented
- Better validation approaches
- New encryption methods

**Update `conventions` section if:**
- Security standards updated
- New compliance requirements
- Header policies changed

### Step 4: Add Learnings Entry
**ALWAYS** add a new learnings entry:

```yaml
learnings:
  - date: 2025-12-16
    insight: "Brief description of what was learned"
    files_affected:
      - src/auth/jwt.ts
      - src/middleware/auth.ts
    context: "Feature: {{argument}}"
```

### Step 5: Validate Updated Expertise
Before saving:
- [ ] All auth file paths exist
- [ ] Security patterns accurate
- [ ] `last_updated` is current
- [ ] No duplicate entries
- [ ] File stays focused (<200 lines)

### Step 6: Save Expertise
Write the updated expertise.yaml file.

## Security-Specific Updates

**After auth changes:**
- Update auth files section
- Document new patterns
- Note any security improvements

**After fixing vulnerabilities:**
- Document CVE in learnings
- Update relevant patterns
- Add prevention to conventions

**After security review:**
- Document findings
- Update OWASP awareness
- Add any new patterns discovered

## Context

{{argument}}

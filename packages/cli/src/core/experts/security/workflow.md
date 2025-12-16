---
description: Plan, build, and improve security feature with expertise-driven workflow
argument-hint: <security feature description>
variables:
  EXPERTISE_FILE: packages/cli/src/core/experts/security/expertise.yaml
---

# Security Expert: Plan → Build → Self-Improve

You are executing a complete security feature implementation with automatic knowledge capture.

## CRITICAL: Three-Step Workflow

**You MUST follow this exact sequence. Do not skip steps.**

---

## Step 1: PLAN (Expertise-Informed)

### 1.1 Load Your Expertise
Read your expertise file at `{{EXPERTISE_FILE}}` FIRST.

Extract from it:
- Authentication implementation locations
- Authorization patterns
- Security configuration
- OWASP awareness

### 1.2 Validate Against Codebase
Before planning, verify your expertise:
```bash
ls -la src/auth/ src/middleware/auth* src/lib/jwt* 2>/dev/null || true
grep -r "bcrypt\|jwt\|session" src/ --include="*.ts" -l 2>/dev/null || true
```

### 1.3 Create Implementation Plan
```markdown
## Security Implementation Plan

### Security Changes
1. [file path] - [change description]
   - OWASP concerns: [list]
   - Validation: [approach]
   - Tests: [security tests needed]

### Pattern to Follow
[Reference security pattern from expertise]

### Threat Model
- Assets protected: [list]
- Attack vectors: [list]
- Mitigations: [list]

### Validation
- [ ] No hardcoded secrets
- [ ] Input validation in place
- [ ] Auth/authz enforced
- [ ] Security tests pass
```

---

## Step 2: BUILD (Execute Plan)

### 2.1 Pre-Build Verification
- Check for existing security implementations
- Verify no secrets in codebase
- Review OWASP Top 10 for this feature

### 2.2 Execute the Plan
```typescript
// Follow security patterns from expertise
import { validateInput } from '@/lib/validation';
import { requireAuth, requireRole } from '@/middleware/auth';

// Always validate input
const sanitizedInput = validateInput(userInput, schema);

// Always check authorization
if (!user.hasPermission('resource:action')) {
  throw new ForbiddenError();
}
```

### 2.3 Capture Changes
```bash
git diff --name-only | grep -E "(auth|security|middleware|valid)"
git diff HEAD
```

### 2.4 Validate Build
- Run security tests
- Check for hardcoded secrets: `grep -r "password\|secret\|apikey" src/`
- Run dependency audit: `npm audit`
- Verify auth flows work correctly

**On Failure**: Stop. Do NOT proceed to self-improve.

---

## Step 3: SELF-IMPROVE (Update Expertise)

**ONLY run if Step 2 succeeded.**

### 3.1 Analyze What Changed
- New auth files added
- Security middleware updated
- Validation patterns added
- Configuration changes

### 3.2 Update Expertise File
Read and update `{{EXPERTISE_FILE}}`:

**Update `files` if:**
- New auth files created
- Security middleware added

**Update `relationships` if:**
- Auth patterns changed
- Authorization flow updated
- New validation approach

**Update `patterns` if:**
- New security pattern implemented
- Better validation approach
- Improved encryption

**Update `conventions` if:**
- Security standards changed
- New compliance requirements
- Header policies updated

### 3.3 Add Learnings Entry
```yaml
learnings:
  - date: 2025-12-16
    insight: "Added [security feature] for [protection]"
    files_affected:
      - src/auth/jwt.ts
    context: "Feature: {{argument}}"
```

### 3.4 Validate and Save
- [ ] All paths exist
- [ ] `last_updated` current
- [ ] No duplicates

---

## Security Feature Request

{{argument}}

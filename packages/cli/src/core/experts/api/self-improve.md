---
description: Update API expertise after making endpoint/middleware changes
argument-hint: [optional context about what changed]
variables:
  EXPERTISE_FILE: packages/cli/src/core/experts/api/expertise.yaml
---

# API Expert - Self-Improve

You are updating your mental model (expertise file) to reflect API changes. This keeps your expertise accurate and useful for future tasks.

## CRITICAL: Self-Improve Workflow

### Step 1: Read Current Expertise
Load your expertise file at `{{EXPERTISE_FILE}}`.

Understand what you currently know about:
- Route file locations
- Middleware structure
- Endpoint registry
- Auth patterns

### Step 2: Analyze What Changed
Identify API changes using:

**Check git diff for API files:**
```bash
git diff HEAD~1 --name-only | grep -E "(api|routes|controllers|middleware|schemas)"
```

**Look for:**
- New endpoints added
- Auth requirements changed
- New middleware introduced
- Validation schemas updated
- Response formats changed

### Step 3: Update Expertise

**Update `files` section if:**
- New route/controller files added
- File structure reorganized
- New middleware introduced

**Update `relationships` (endpoint registry) if:**
- New endpoints created
- Endpoints modified or removed
- Auth requirements changed

Example addition:
```yaml
relationships:
  - endpoint: "POST /api/sessions"
    controller: SessionController.create
    auth_required: false
    validation: loginSchema
    rate_limited: true
```

**Update `patterns` section if:**
- New auth pattern introduced
- Validation approach changed
- Error handling updated
- New API conventions adopted

**Update `conventions` section if:**
- Response format changed
- New headers required
- Naming conventions updated

**ALWAYS add to `learnings` section:**
```yaml
learnings:
  - date: 2025-12-16
    insight: "Added rate limiting to public auth endpoints"
    files_affected:
      - src/api/middleware/rateLimit.ts
      - src/api/routes/auth.routes.ts
    context: "US-0050 - Security improvements"
```

### Step 4: Validate Updated Model
After updating, verify:
1. All route file paths still exist
2. Endpoint registry matches actual routes
3. Auth patterns match middleware code
4. Conventions reflect current practice

### Step 5: Write Updated Expertise
Save the updated expertise.yaml file with:
- Updated `last_updated` timestamp
- New/modified sections
- New learnings entry

## API-Specific Rules

### DO:
- Track all public endpoints
- Note auth requirements per endpoint
- Record validation patterns
- Document rate limiting
- Update when API version changes

### DON'T:
- Store API keys or secrets
- Include sensitive business logic details
- Keep deprecated endpoint references
- Document internal-only implementation details

## Quality Checklist

Before saving:
- [ ] `last_updated` is today's date
- [ ] All route file paths verified
- [ ] Endpoint registry accurate
- [ ] New learnings entry added
- [ ] No references to removed endpoints
- [ ] Expertise stays focused (<200 lines)

## Context

{{argument}}

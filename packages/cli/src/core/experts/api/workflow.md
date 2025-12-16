---
description: Plan, build, and improve API feature with expertise-driven workflow
argument-hint: <API feature description>
variables:
  EXPERTISE_FILE: packages/cli/src/core/experts/api/expertise.yaml
---

# API Expert: Plan → Build → Self-Improve

You are executing a complete API feature implementation with automatic knowledge capture. This workflow ensures you leverage existing API expertise, execute efficiently, and capture learnings for future tasks.

## CRITICAL: Three-Step Workflow

**You MUST follow this exact sequence. Do not skip steps.**

---

## Step 1: PLAN (Expertise-Informed)

### 1.1 Load Your Expertise
Read your expertise file at `{{EXPERTISE_FILE}}` FIRST.

Extract from it:
- Route file locations and patterns
- Controller/handler structure
- Middleware chain
- Authentication patterns
- Response format conventions
- Recent learnings that might apply

### 1.2 Validate Against Codebase
Before planning, verify your expertise is accurate:

```bash
# Check API route files exist
ls -la src/api/ src/routes/ app/api/ pages/api/ 2>/dev/null || true

# Check for recent API changes
git log --oneline -5 -- "**/*api*" "**/*route*" "**/controller*" 2>/dev/null || true
```

Note any discrepancies between expertise and actual state.

### 1.3 Create Implementation Plan
Based on validated expertise, create a specific plan:

```markdown
## API Implementation Plan

### Endpoints to Create/Modify
1. [METHOD] [/path] - [purpose]
   - Request: [body/params schema]
   - Response: [response schema]
   - Auth: [required auth level]

### Files to Create/Modify
- [route file path]
- [controller/handler path]
- [validation schema path]
- [types/interfaces path]

### Pattern to Follow
[Reference specific pattern from expertise - e.g., "Use REST conventions from /users endpoints"]

### Middleware Required
- [auth middleware if needed]
- [validation middleware]
- [rate limiting if applicable]

### Validation
- [ ] Endpoint responds correctly
- [ ] Auth enforced properly
- [ ] Error responses follow format
- [ ] Types are accurate
```

**Output**: A detailed plan with exact file paths and specific changes.

---

## Step 2: BUILD (Execute Plan)

### 2.1 Pre-Build Verification
Before making changes:
- Ensure referenced middleware exists
- Verify auth patterns are in place
- Check for route conflicts

### 2.2 Execute the Plan
Follow your implementation plan:

**Create route file:**
```typescript
// Follow existing route patterns from expertise
// Use consistent naming conventions
// Apply required middleware
```

**Create handler/controller:**
```typescript
// Follow controller pattern from expertise
// Use proper error handling
// Return consistent response format
```

### 2.3 Capture Changes
After building, document what changed:

```bash
# Capture the diff for self-improve
git diff --name-only | grep -E "(api|route|controller|handler)"
git diff HEAD
```

### 2.4 Validate Build
Verify the implementation:
- Endpoint responds to requests
- Auth works as expected
- Validation catches invalid input
- Types compile without errors

**Output**: Working API endpoint(s) with captured diff.

**On Failure**: Stop and report the error. Do NOT proceed to self-improve.

---

## Step 3: SELF-IMPROVE (Update Expertise)

**ONLY run this step if Step 2 succeeded.**

### 3.1 Analyze What Changed
Review the git diff and identify:
- New endpoints added
- New route files created
- New middleware applied
- New response patterns used
- New validation schemas

### 3.2 Update Expertise File
Read and update `{{EXPERTISE_FILE}}`:

**Update `files` section if:**
```yaml
files:
  routes:
    - path: path/to/new/route.ts
      purpose: "New endpoint for [feature]"
```

**Update `relationships` section if:**
```yaml
relationships:
  - route: /api/v1/new-resource
    controller: NewResourceController
    methods: [GET, POST]
    auth: required
```

**Update `patterns` section if:**
New pattern discovered or confirmed.

**Update `conventions` section if:**
New naming or structural conventions applied.

### 3.3 Add Learnings Entry
**ALWAYS** add a new learnings entry:

```yaml
learnings:
  - date: 2025-12-16
    insight: "Added [endpoint] for [purpose]"
    files_affected:
      - path/to/route
      - path/to/controller
    context: "Feature: {{argument}}"
```

### 3.4 Validate Updated Expertise
Before saving:
- [ ] All file paths exist
- [ ] Routes match actual endpoints
- [ ] `last_updated` is current
- [ ] No duplicate endpoint entries
- [ ] File stays focused (<200 lines)

### 3.5 Save Expertise
Write the updated expertise.yaml file.

---

## API-Specific Error Handling

### If Route Conflicts
- Check for duplicate paths
- Verify HTTP methods don't conflict
- Check route ordering (specific before general)

### If Auth Fails
- Verify middleware is applied
- Check auth token handling
- Verify permissions are correct

### If Validation Fails
- Check schema matches request
- Verify required fields
- Check type coercion

---

## Example Usage

**Request**: "Add endpoint to fetch user sessions"

**Step 1 Output** (Plan):
```markdown
## API Implementation Plan

### Endpoints to Create/Modify
1. GET /api/v1/users/:id/sessions - List user sessions
   - Request: { params: { id: string }, query: { limit?, offset? } }
   - Response: { sessions: Session[], total: number }
   - Auth: required (own user or admin)

### Files to Create/Modify
- src/api/v1/users/[id]/sessions/route.ts
- src/types/session.ts (if needed)

### Pattern to Follow
Using nested resource pattern from /users/:id/posts
Using pagination pattern from /users endpoint
```

**Step 2 Output** (Build):
- Created route file at src/api/v1/users/[id]/sessions/route.ts
- Added Session type to types
- Applied auth middleware
- Diff: 2 files changed

**Step 3 Output** (Self-Improve):
- Added sessions endpoint to routes list
- Added learning: "Added nested sessions endpoint under users"

---

## Feature Request

{{argument}}

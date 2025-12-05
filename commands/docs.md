---
description: Synchronize documentation with code changes
allowed-tools: Bash, Read, Edit, Write, Glob, Grep
---

# docs-sync

Synchronize documentation with codebase changes.

## Prompt

ROLE: Documentation Synchronizer

OBJECTIVE
Detect code changes and ensure corresponding documentation is created or updated.

INPUTS (optional)
- BRANCH=<branch name> (default: current branch)
- BASE=<base branch> (default: main/master)
- AUTO_CREATE=yes|no (default: no, ask first)

DETECTION WORKFLOW
1. Get git diff between BASE and BRANCH:
   ```bash
   git diff <BASE>...<BRANCH> --name-status
   ```

2. Categorize changes:
   - **New API endpoints**: src/api/, src/routes/, src/controllers/
   - **New UI components**: src/components/, src/pages/
   - **New utilities/services**: src/services/, src/utils/
   - **Config changes**: *.config.js, *.yml, .env.example
   - **Database changes**: migrations/, schema/

3. Map to expected docs:
   - API endpoints → docs/04-architecture/api.md or OpenAPI spec
   - UI components → docs/04-architecture/components.md or Storybook
   - Services → docs/04-architecture/services.md
   - Config → docs/02-practices/configuration.md
   - Migrations → docs/04-architecture/database.md

ANALYSIS
For each changed file:
```
File: src/api/auth/login.ts (ADDED)
Expected doc: docs/04-architecture/api.md
Section: Authentication Endpoints
Status: ❌ MISSING (section exists but endpoint not documented)

Suggestion:
## POST /api/auth/login
**Added**: <date>
**Story**: <US_ID if found in commit>

Request:
\`\`\`json
{ "email": "string", "password": "string" }
\`\`\`

Response:
\`\`\`json
{ "token": "string", "user": {...} }
\`\`\`

Authentication: None (public endpoint)
Rate limit: 5 requests/minute
```

GAP REPORT
```markdown
# Documentation Sync Report

**Branch**: <BRANCH>
**Base**: <BASE>
**Generated**: <ISO timestamp>

## Missing Documentation

### API Endpoints (3)
- ❌ POST /api/auth/login (src/api/auth/login.ts)
- ❌ GET /api/users/:id (src/api/users/get.ts)
- ❌ DELETE /api/sessions (src/api/sessions/delete.ts)

### UI Components (2)
- ❌ LoginForm (src/components/LoginForm.tsx)
- ⚠️ UserProfile (src/components/UserProfile.tsx) - stub exists, needs details

### Configuration (1)
- ❌ New env var: JWT_SECRET (.env.example)

## Outdated Documentation

### Deprecated
- 📄 docs/04-architecture/api.md mentions /api/v1/login (removed in this branch)

## Up-to-Date
- ✅ UserAvatar component documented
- ✅ Database schema up-to-date
```

ACTIONS (after user review)
1. For missing docs:
   - Generate stub documentation with placeholders
   - Preview (diff-first)
   - Ask: "Create missing documentation? (YES/NO)"

2. For outdated docs:
   - Suggest removals or updates
   - Preview changes
   - Ask: "Update outdated sections? (YES/NO)"

3. If AUTO_CREATE=yes:
   - Create all missing docs automatically
   - Mark sections with "TODO: Add details" for manual review
   - Commit: "docs: sync with codebase changes"

SMART INFERENCE
Try to infer documentation from:
- TypeScript types/interfaces
- JSDoc comments
- OpenAPI decorators
- Function signatures
- Test files (use as examples)

Example:
```typescript
// Code: src/api/auth/login.ts
/**
 * Authenticates user with email and password
 * @returns JWT token and user profile
 */
export async function login(req: Request, res: Response) {
  const { email, password } = req.body;
  // ...
}

// Generated doc:
## POST /api/auth/login
Authenticates user with email and password.
Returns JWT token and user profile.
```

INTEGRATION
- Create story if significant doc gaps found: "US-XXXX: Update documentation for <feature>"
- Append to docs/09-agents/bus/log.jsonl: {"type":"docs-sync","missing":3,"outdated":1}
- Optionally add to PR checklist: "- [ ] Documentation updated"

CI INTEGRATION
Suggest adding to PR checks:
```yaml
- name: Check docs sync
  run: npx claude-code /AgileFlow:docs-sync BRANCH=${{ github.head_ref }}
  # Fail if critical docs missing (e.g., public API endpoints)
```

RULES
- Never delete docs without explicit approval
- Preserve custom content (don't overwrite manually written sections)
- Use managed section markers: <!-- MANAGED:api-endpoints --> ... <!-- /MANAGED -->
- Link docs to source files for traceability
- Diff-first, YES/NO for all changes

OUTPUT
- Gap report (markdown)
- List of actions to take
- Optional: PR with doc updates (if approved)

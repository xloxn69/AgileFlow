---
description: Synchronize documentation with code changes
argument-hint: [BRANCH=<name>] [BASE=<branch>] [AUTO_CREATE=yes|no]
---

# docs-sync

Synchronize documentation with codebase changes.

---

## STEP 0: Gather Context

```bash
node .agileflow/scripts/obtain-context.js docs
```

---

<!-- COMPACT_SUMMARY_START -->
## Compact Summary

**Purpose**: Automatically detect code changes and synchronize documentation to prevent drift.

**Core Workflow**:
1. Activate command using STEP 0 registration script
2. Compare branch against base using git diff
3. Categorize changes (API, UI, services, config, database)
4. Map code changes to expected documentation locations
5. Analyze gaps (missing docs, outdated docs, deprecated references)
6. Generate gap report with status indicators (❌ missing, ⚠️ incomplete, ✅ up-to-date)
7. Preview suggested documentation updates
8. Get explicit user approval before making changes

**Critical Rules**:
- NEVER delete documentation without explicit user approval
- ALWAYS use diff-first, YES/NO pattern for all modifications
- PRESERVE custom content - don't overwrite manually written sections
- USE managed section markers: `<!-- MANAGED:section-id --> ... <!-- /MANAGED -->`
- LINK docs to source files for traceability
- INFER documentation from TypeScript types, JSDoc, OpenAPI decorators, test files

**Expected Documentation Mapping**:
- API endpoints → `docs/04-architecture/api.md` or OpenAPI spec
- UI components → `docs/04-architecture/components.md` or Storybook
- Services/utilities → `docs/04-architecture/services.md`
- Configuration → `docs/02-practices/configuration.md`
- Database migrations → `docs/04-architecture/database.md`

**Smart Inference Sources**:
- TypeScript types and interfaces
- JSDoc comments and annotations
- OpenAPI/Swagger decorators
- Function signatures and parameters
- Test files as usage examples

**Auto-Create Mode** (AUTO_CREATE=yes):
- Creates all missing documentation automatically
- Marks sections with "TODO: Add details" for manual review
- Commits with message: "docs: sync with codebase changes"

**Integration Features**:
- Create tracking story for significant doc gaps
- Log to agent bus: `{"type":"docs-sync","missing":N,"outdated":N}`
- Suggest PR checklist item: "- [ ] Documentation updated"
- Recommend CI integration for automated checks

**Gap Report Format**:
```markdown
# Documentation Sync Report
**Branch**: <name> | **Base**: <branch> | **Generated**: <timestamp>

## Missing Documentation
### API Endpoints (N)
- ❌ POST /endpoint (src/path/file.ts)

## Outdated Documentation
- 📄 Deprecated references to removed code

## Up-to-Date
- ✅ Correctly documented components
```

**Output Deliverables**:
- Markdown gap report with categorized findings
- List of recommended actions with previews
- Optional: Pull request with documentation updates (if approved)
<!-- COMPACT_SUMMARY_END -->

---

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
  run: npx claude-code /agileflow:docs-sync BRANCH=${{ github.head_ref }}
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

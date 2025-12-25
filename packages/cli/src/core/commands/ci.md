---
description: Bootstrap CI/CD workflow with testing and quality checks
---

# ci-setup

STEP 0: ACTIVATE COMPACT SUMMARY MODE
Before reading the full command, execute this script to display the compact summary:
```bash
sed -n '/<!-- COMPACT_SUMMARY_START -->/,/<!-- COMPACT_SUMMARY_END -->/p' "$(dirname "$0")/ci.md" | grep -v "COMPACT_SUMMARY"
```
If the user confirms they want the full details, continue. Otherwise, stop here.

Bootstrap minimal CI workflow and CODEOWNERS.

<!-- COMPACT_SUMMARY_START -->
## Compact Summary

**Purpose**: Bootstrap minimal CI/CD workflow with testing and quality checks

**Quick Usage**:
```
/agileflow:ci-setup OWNERS=@username,@team
```

**What It Does**:
1. Creates `.github/workflows/ci.yml` with lint/typecheck/test jobs
2. Creates `CODEOWNERS` file with owner mappings
3. Shows preview and waits for YES/NO confirmation
4. Provides notes for enabling required checks in GitHub

**Required Inputs**:
- `OWNERS=<@handles>` - GitHub usernames or team handles (comma-separated)

**Optional Inputs**:
- None

**Output Files**:
- `.github/workflows/ci.yml` - GitHub Actions workflow
- `CODEOWNERS` - Code ownership mappings

**CI Jobs Created**:
- Lint job (generic placeholder for ESLint, Prettier, etc.)
- Typecheck job (TypeScript, Flow, mypy, etc.)
- Test job (Jest, pytest, cargo test, etc.)
- Minimal permissions (contents: read)
- Concurrency control (cancel in-progress runs)

**CODEOWNERS Mappings**:
```
/src/ @owners
/docs/03-decisions/ @owners
```

**Tools Used**:
- TodoWrite: Track 5-step setup workflow

**TodoWrite Example**:
```xml
<invoke name="TodoWrite">
<parameter name="content">
1. Parse input (OWNERS)
2. Create .github/workflows/ci.yml with lint/typecheck/test jobs
3. Create CODEOWNERS file with owner mappings
4. Show preview and wait for YES/NO confirmation
5. Print notes for enabling required checks
</parameter>
<parameter name="status">in-progress</parameter>
</invoke>
```

**Workflow**:
1. Parse OWNERS input
2. Generate CI workflow with generic job placeholders
3. Generate CODEOWNERS file
4. Show preview of both files
5. Ask: "Create these files? (YES/NO)"
6. If YES: Write files
7. Display notes for enabling required checks

**Next Steps**:
- Customize job commands for your project
- Enable branch protection in GitHub settings
- Add required status checks
- Configure merge queue (optional)

**Example CI Workflow**:
```yaml
name: CI
on: [push, pull_request]
jobs:
  lint:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - run: npm run lint
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - run: npm test
```
<!-- COMPACT_SUMMARY_END -->

## Prompt

ROLE: CI Bootstrapper

TODO LIST TRACKING
**CRITICAL**: Immediately create a todo list using TodoWrite tool to track CI setup:
```
1. Parse input (OWNERS)
2. Create .github/workflows/ci.yml with lint/typecheck/test jobs
3. Create CODEOWNERS file with owner mappings
4. Show preview and wait for YES/NO confirmation
5. Print notes for enabling required checks
```

Mark each step complete as you finish it. This ensures nothing is forgotten.

INPUT
OWNERS=<@handles>

ACTIONS
1) Create .github/workflows/ci.yml with jobs for lint, typecheck, tests (generic placeholders), minimal permissions, concurrency.
2) Create CODEOWNERS with:
   /src/  <OWNERS>
   /docs/03-decisions/  <OWNERS>
3) Print notes for enabling required checks.

Diff-first; YES/NO.

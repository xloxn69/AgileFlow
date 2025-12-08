---
description: Bootstrap CI/CD workflow with testing and quality checks
allowed-tools: Bash, Read, Edit, Write, Glob, Grep
---

# ci-setup

Bootstrap minimal CI workflow and CODEOWNERS.

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

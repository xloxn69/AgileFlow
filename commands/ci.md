---
description: ci-setup
allowed-tools: Bash, Read, Edit, Write, Glob, Grep
---

# ci-setup

Bootstrap minimal CI workflow and CODEOWNERS.

## Prompt

ROLE: CI Bootstrapper

INPUT
OWNERS=<@handles>

ACTIONS
1) Create .github/workflows/ci.yml with jobs for lint, typecheck, tests (generic placeholders), minimal permissions, concurrency.
2) Create CODEOWNERS with:
   /src/  <OWNERS>
   /docs/03-decisions/  <OWNERS>
3) Print notes for enabling required checks.

Diff-first; YES/NO.

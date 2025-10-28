---
description: pr-template
allowed-tools: Bash, Read, Edit, Write, Glob, Grep
---

# pr-template

Generate a complete PR description from story and test evidence.

## Prompt

ROLE: PR Author

INPUTS
STORY=<US-ID>  TITLE=<short>
AC_CHECKED=<checkbox list>  TEST_EVIDENCE=<bullets/paths>  NOTES=<optional>

ACTIONS
1) Read story file to pull epic/summary/deps.
2) Output a paste-ready PR body including: Title "<STORY>: <TITLE>", Summary, Linked Issues (story+deps), Checklist (AC with checked state), Test Evidence, Screens/GIFs, Risk/Rollback, Owners (@CODEOWNERS).
3) Suggest a Conventional Commit subject for squash.

No file writes.

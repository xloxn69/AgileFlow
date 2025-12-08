---
description: Generate pull request description from story
allowed-tools: Bash, Read, Edit, Write, Glob, Grep
---

# pr-template

Generate a complete PR description from story and test evidence.

## Prompt

ROLE: PR Author

TODO LIST TRACKING
**CRITICAL**: Immediately create a todo list using TodoWrite tool to track PR description generation:
```
1. Parse inputs (STORY, TITLE, AC_CHECKED, TEST_EVIDENCE, NOTES)
2. Read story file to extract epic/summary/deps
3. Generate PR description with all sections
4. Output paste-ready PR body
5. Suggest Conventional Commit subject for squash
```

Mark each step complete as you finish it. This ensures nothing is forgotten.

INPUTS
STORY=<US-ID>  TITLE=<short>
AC_CHECKED=<checkbox list>  TEST_EVIDENCE=<bullets/paths>  NOTES=<optional>

ACTIONS
1) Read story file to pull epic/summary/deps.
2) Output a paste-ready PR body including: Title "<STORY>: <TITLE>", Summary, Linked Issues (story+deps), Checklist (AC with checked state), Test Evidence, Screens/GIFs, Risk/Rollback, Owners (@CODEOWNERS).
3) Suggest a Conventional Commit subject for squash.

No file writes.

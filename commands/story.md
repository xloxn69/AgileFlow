---
description: story-new
allowed-tools: Bash, Read, Edit, Write, Glob, Grep
---

# story-new

Create a new user story with acceptance criteria and test stubs.

## Prompt

ROLE: Story Creator

INPUTS
EPIC=<EP-ID>  STORY=<US-ID>  TITLE=<title>
OWNER=<name or agent id>  ESTIMATE=<e.g., 0.5d>
DEPENDENCIES=[US-000X,...] (optional)
AC=<Given/When/Then bullets>

ACTIONS
1) Create docs/06-stories/<EPIC>/<STORY>-<slug>.md from story-template.md with frontmatter & AC.
2) Create docs/07-testing/test-cases/<STORY>.md (stub referencing AC).
3) Merge into docs/09-agents/status.json; append "assign" line to bus/log.jsonl.

Diff-first; YES/NO.

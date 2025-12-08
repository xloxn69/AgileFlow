---
description: Create a user story with acceptance criteria
allowed-tools: Bash, Read, Edit, Write, Glob, Grep
---

# story-new

Create a new user story with acceptance criteria and test stubs.

## Prompt

ROLE: Story Creator

TODO LIST TRACKING
**CRITICAL**: Immediately create a todo list using TodoWrite tool to track story creation:
```
1. Parse inputs (EPIC, STORY, TITLE, OWNER, ESTIMATE, DEPENDENCIES, AC)
2. Create docs/06-stories/<EPIC>/<STORY>-<slug>.md from template
3. Create docs/07-testing/test-cases/<STORY>.md stub
4. Merge into docs/09-agents/status.json
5. Append assign line to bus/log.jsonl
6. Show preview and wait for YES/NO confirmation
```

Mark each step complete as you finish it. This ensures nothing is forgotten.

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

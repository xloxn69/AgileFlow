---
description: Create a user story with acceptance criteria
argument-hint: EPIC=<EP-ID> STORY=<US-ID> TITLE=<text> OWNER=<id> [ESTIMATE=<pts>] [AC=<list>]
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
6. Show preview and confirm with AskUserQuestion
```

Mark each step complete as you finish it. This ensures nothing is forgotten.

INPUTS
EPIC=<EP-ID>  STORY=<US-ID>  TITLE=<title>
OWNER=<name or agent id>  ESTIMATE=<e.g., 0.5d>
DEPENDENCIES=[US-000X,...] (optional)
AC=<Given/When/Then bullets>

TEMPLATE
Use the following template structure:
@packages/cli/src/core/templates/story-template.md

ACTIONS
1) Create docs/06-stories/<EPIC>/<STORY>-<slug>.md from story-template.md with frontmatter & AC.
2) Create docs/07-testing/test-cases/<STORY>.md (stub referencing AC).
3) Merge into docs/09-agents/status.json; append "assign" line to bus/log.jsonl.

**Show diff-first, then confirm with AskUserQuestion**:
```xml
<invoke name="AskUserQuestion">
<parameter name="questions">[{
  "question": "Create story <STORY>: <TITLE> with these files?",
  "header": "Create story",
  "multiSelect": false,
  "options": [
    {
      "label": "Yes, create story",
      "description": "Write story file, test stub, and update status.json (Recommended)"
    },
    {
      "label": "No, revise first",
      "description": "I want to modify the content before creating"
    },
    {
      "label": "Cancel",
      "description": "Don't create this story"
    }
  ]
}]</parameter>
</invoke>
```

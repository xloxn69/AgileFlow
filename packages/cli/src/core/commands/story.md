---
description: Create a user story with acceptance criteria
argument-hint: EPIC=<EP-ID> STORY=<US-ID> TITLE=<text> OWNER=<id> [ESTIMATE=<pts>] [AC=<list>]
---

# story-new

Create a new user story with acceptance criteria and test stubs.

---

## 🚨 STEP 0: ACTIVATE COMMAND (REQUIRED FIRST)

**Before doing ANYTHING else, run this to register the command for context preservation:**

```bash
node -e "
const fs = require('fs');
const path = 'docs/09-agents/session-state.json';
if (fs.existsSync(path)) {
  const state = JSON.parse(fs.readFileSync(path, 'utf8'));
  state.active_command = { name: 'story', activated_at: new Date().toISOString(), state: {} };
  fs.writeFileSync(path, JSON.stringify(state, null, 2) + '\n');
  console.log('✅ Story command activated');
}
"
```

---

<!-- COMPACT_SUMMARY_START -->
## Compact Summary

**Purpose**: Story Creator - Creates structured user stories with acceptance criteria, test stubs, and status tracking

**Role**: Story Creator agent responsible for creating well-structured user stories following AgileFlow conventions

**Critical Rules**:
- MUST use TodoWrite to track all 6 steps (parse, create story, create test stub, update status.json, append to bus/log.jsonl, confirm)
- MUST show preview before creating files (use AskUserQuestion with proper XML invoke format)
- NEVER ask users to "type" - always use proper options format (see docs/02-practices/ask-user-question.md)
- MUST use story-template.md as the base structure
- MUST create test stub referencing acceptance criteria
- MUST update both status.json and bus/log.jsonl
- Story files go in: docs/06-stories/<EPIC>/<STORY>-<slug>.md
- Test stubs go in: docs/07-testing/test-cases/<STORY>.md

**Required Inputs**:
- EPIC=<EP-ID> - Epic identifier (e.g., EP-0001)
- STORY=<US-ID> - Story identifier (e.g., US-0007)
- TITLE=<text> - Story title
- OWNER=<id> - Owner name or agent ID
- ESTIMATE=<pts> - Time estimate (e.g., 0.5d, 2h)
- AC=<list> - Acceptance criteria (Given/When/Then format)
- DEPENDENCIES=[...] - Optional array of dependent story IDs

**Workflow Steps**:
1. Parse all inputs and validate format
2. Create story file from template with frontmatter
3. Create test case stub referencing AC
4. Merge story into status.json
5. Append assign event to bus/log.jsonl
6. Show preview and get user confirmation

**Template Location**: packages/cli/src/core/templates/story-template.md

**Output Files**:
- Story: docs/06-stories/<EPIC>/<STORY>-<slug>.md
- Test: docs/07-testing/test-cases/<STORY>.md
- Status: docs/09-agents/status.json (merged)
- Log: docs/09-agents/bus/log.jsonl (appended)

**AskUserQuestion Format** (XML invoke):
```xml
<invoke name="AskUserQuestion">
<parameter name="questions">[{
  "question": "Create story <STORY>: <TITLE> with these files?",
  "header": "Create story",
  "multiSelect": false,
  "options": [
    {"label": "Yes, create story", "description": "Write story file, test stub, and update status.json (Recommended)"},
    {"label": "No, revise first", "description": "I want to modify the content before creating"},
    {"label": "Cancel", "description": "Don't create this story"}
  ]
}]</parameter>
</invoke>
```

**Success Criteria**:
- All 6 todo items marked complete
- Story file created with proper frontmatter
- Test stub created and linked to AC
- status.json updated with new story
- bus/log.jsonl has assign event
- User confirmed creation

<!-- COMPACT_SUMMARY_END -->

## Prompt

ROLE: Story Creator

🔴 **AskUserQuestion Format**: NEVER ask users to "type" anything. Use proper options with XML invoke format. See `docs/02-practices/ask-user-question.md`.

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

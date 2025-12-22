---
description: Create a new epic with stories
argument-hint: EPIC=<EP-ID> TITLE=<text> OWNER=<id> GOAL=<text> [STORIES=<list>]
---

# epic-new

---

## STEP 0: Gather Context

```bash
node scripts/obtain-context.js epic
```

This gathers git status, stories/epics, session state, and registers for PreCompact.

---

Create a new epic with optional child stories.

<!-- COMPACT_SUMMARY_START -->
## Compact Summary

**Purpose**: Create structured epics with associated user stories for feature planning.

**Role**: Epic Creator - Analyzes requirements, structures epics, creates stories, manages dependencies.

**Critical Behavioral Rules**:
- ALWAYS use TodoWrite tool IMMEDIATELY to track epic creation steps
- ALWAYS show previews before writing any files
- ALWAYS wait for YES/NO confirmation before executing writes
- NEVER create files without explicit user confirmation
- ALWAYS merge entries into status.json (never overwrite)
- ALWAYS append to bus/log.jsonl (never overwrite)
- Parse all required inputs: EPIC, TITLE, OWNER, GOAL
- Parse optional STORIES input (comma-separated triplets)

**Key Workflow Steps**:
1. Create todo list with TodoWrite (6 steps: parse, create epic, create stories, merge status, append bus, confirm)
2. Parse inputs: EPIC=<ID>, TITLE=<text>, OWNER=<id>, GOAL=<text>, STORIES=<list>
3. Create docs/05-epics/<EPIC>.md from epic-template.md
   - Status: active
   - Created/updated: current timestamp
4. For each story in STORIES (format: "US_ID|title|owner"):
   - Create docs/06-stories/<EPIC>/<US_ID>-<slug>.md from story-template.md
   - Status: ready, estimate: 0.5d, deps: []
5. Merge into docs/09-agents/status.json:
   - Add/update epic entry (id, owner, status, summary, last_update)
   - Add/update story entries (id, owner, status, branch, summary, last_update)
6. Append assign lines to docs/09-agents/bus/log.jsonl:
   - Format: {"timestamp":"ISO","type":"assign","epic":"EP-ID","owner":"name"}
   - For each story: {"timestamp":"ISO","type":"assign","story":"US-ID","owner":"name"}

**Input Format**:
- EPIC=<ID> (e.g., EP-0001)
- TITLE=<Epic title>
- OWNER=<name or agent-id>
- GOAL=<outcome/metric>
- STORIES=<optional> (format: "US-0001|Story Title|owner,US-0002|Another Story|owner2")

**Output Format Requirements**:
- Epic file: docs/05-epics/<EPIC>.md (use epic-template.md structure)
- Story files: docs/06-stories/<EPIC>/<US_ID>-<slug>.md (use story-template.md structure)
- Status.json: Merge entries (preserve existing data)
- Bus log: Append JSONL entries (one per epic/story assignment)

**Templates Used**:
- packages/cli/src/core/templates/epic-template.md
- packages/cli/src/core/templates/story-template.md

**Confirmation Flow**:
1. Show epic preview (file path, title, owner, goal, status)
2. Show story previews (file paths, titles, owners, estimates)
3. Show status.json merge preview
4. Show bus/log.jsonl append preview
5. Ask: "Proceed with epic creation? (YES/NO)"
6. On YES: Execute all writes
7. On NO: Abort without changes
<!-- COMPACT_SUMMARY_END -->

## Prompt

ROLE: Epic Creator

OBJECTIVE
Analyze feature requirements and create structured epics with associated stories. Evaluate story breakdown, assess dependencies, and consider implementation sequencing to ensure comprehensive planning.

TODO LIST TRACKING
**CRITICAL**: Immediately create a todo list using TodoWrite tool to track epic creation:
```
1. Parse inputs (EPIC, TITLE, OWNER, GOAL, STORIES)
2. Create docs/05-epics/<EPIC>.md from template
3. For each story: create docs/06-stories/<EPIC>/<US_ID>-<slug>.md
4. Merge entries into docs/09-agents/status.json
5. Append assign lines to docs/09-agents/bus/log.jsonl
6. Show preview and wait for YES/NO confirmation
```

Mark each step complete as you finish it. This ensures nothing is forgotten.

INPUTS
EPIC=<ID e.g., EP-0001>
TITLE=<Epic title>
OWNER=<name or agent id>
GOAL=<outcome/metric>
STORIES=<optional> comma-separated "<US_ID>|<short title>|<owner>"

TEMPLATE
Use the following epic template structure:
@packages/cli/src/core/templates/epic-template.md

ACTIONS
1) Create docs/05-epics/<EPIC>.md from epic-template.md (status=active; created/updated=now).
2) For each story, create docs/06-stories/<EPIC>/<US_ID>-<slug>.md from story-template.md (status=ready; estimate=0.5d; deps=[]).
3) Merge entries into docs/09-agents/status.json (owner,status,branch,summary,last_update).
4) Append "assign" lines to docs/09-agents/bus/log.jsonl.

Always show previews; YES/NO before writing.

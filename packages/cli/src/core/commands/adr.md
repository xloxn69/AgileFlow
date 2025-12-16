---
description: Create an Architecture Decision Record
argument-hint: NUMBER=<4-digit> TITLE=<text> CONTEXT=<text> DECISION=<text> CONSEQUENCES=<text> [LINKS=<text>]
---

# adr-new

Create a new Architecture Decision Record.

## Prompt

ROLE: ADR Writer

TODO LIST TRACKING
**CRITICAL**: Immediately create a todo list using TodoWrite tool to track ADR creation:
```
1. Parse inputs (NUMBER, TITLE, CONTEXT, DECISION, CONSEQUENCES, LINKS)
2. Create docs/03-decisions/adr-<NUMBER>-<slug>.md from template
3. Show preview and wait for YES/NO confirmation
```

Mark each step complete as you finish it. This ensures nothing is forgotten.

INPUTS
NUMBER=<4-digit>  TITLE=<Decision Title>
CONTEXT=<short context>  DECISION=<choice>
CONSEQUENCES=<trade-offs>  LINKS=<optional bullets>

TEMPLATE
Use the following ADR template structure:
@packages/cli/src/core/templates/adr-template.md

ACTION
Create docs/03-decisions/adr-<NUMBER>-<slug>.md from adr-template.md (date=now; status=Accepted unless specified).

Diff-first; YES/NO.

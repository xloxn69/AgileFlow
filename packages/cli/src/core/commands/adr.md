---
description: Create an Architecture Decision Record
argument-hint: NUMBER=<4-digit> TITLE=<text> CONTEXT=<text> DECISION=<text> CONSEQUENCES=<text> [LINKS=<text>]
---

# adr-new

Create a new Architecture Decision Record.

## STEP 0: Gather Context

```bash
node .agileflow/scripts/obtain-context.js adr
```

<!-- COMPACT_SUMMARY_START -->
## Compact Summary

**Command**: `adr` - Create Architecture Decision Records (ADRs) documenting architectural choices

**Quick Usage**:
```
/agileflow:adr NUMBER=0042 TITLE="Use PostgreSQL for persistence" CONTEXT="Need reliable ACID database" DECISION="PostgreSQL chosen over MongoDB" CONSEQUENCES="Better data integrity, steeper learning curve"
```

**What It Does**: Parse inputs → Create ADR file → Show preview → Write if approved

### Tool Usage Examples

**TodoWrite** (to track ADR creation):
```xml
<invoke name="TodoWrite">
<parameter name="content">1. Parse inputs (NUMBER, TITLE, CONTEXT, DECISION, CONSEQUENCES, LINKS)
2. Create docs/03-decisions/adr-<NUMBER>-<slug>.md from template
3. Show preview and wait for YES/NO confirmation</parameter>
<parameter name="status">in-progress</parameter>
<parameter name="activeForm">1</parameter>
</invoke>
```

**Write** (to create ADR file):
```xml
<invoke name="Write">
<parameter name="file_path">/full/path/to/docs/03-decisions/adr-0042-postgresql.md</parameter>
<parameter name="content">---
number: 0042
title: Use PostgreSQL for persistence
date: 2025-12-22
status: accepted
tags: [database, architecture]
---

# ADR-0042: Use PostgreSQL for persistence

## Context
We need a reliable database with ACID guarantees for user data...

## Decision
We will use PostgreSQL as our primary database...

## Consequences
- Better data integrity and reliability
- Team needs PostgreSQL training
- Slightly higher operational complexity than NoSQL

## Related
- [ADR-0041: Database selection process](adr-0041-db-selection.md)
- [US-0055: Database migration](../06-stories/US-0055.md)</parameter>
</invoke>
```

**AskUserQuestion** (for confirmation):
```xml
<invoke name="AskUserQuestion">
<parameter name="questions">[{"question": "Create this ADR?", "header": "Preview", "multiSelect": false, "options": [{"label": "Yes, create ADR", "description": "Write ADR-0042 to docs/03-decisions/"}, {"label": "No, abort", "description": "Cancel without creating"}]}]</parameter>
</invoke>
```

**Template Structure**:
- Frontmatter (number, title, date, status, tags)
- Context section (why decision needed)
- Decision section (what was chosen)
- Consequences section (trade-offs and impacts)
- Optional links to related docs

**Best Practices**:
- Number ADRs sequentially (0001, 0002, etc.)
- Write context before decision (explain the "why")
- Document both positive and negative consequences
- Keep concise (1-2 pages max)
- Link related ADRs and stories

<!-- COMPACT_SUMMARY_END -->

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

ACTIONS
1) Parse inputs (NUMBER, TITLE, CONTEXT, DECISION, CONSEQUENCES, LINKS)
2) Create docs/03-decisions/adr-<NUMBER>-<slug>.md from template
3) Show diff and wait for YES/NO confirmation
4) Write file if approved

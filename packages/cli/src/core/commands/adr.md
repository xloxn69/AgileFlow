---
description: Create an Architecture Decision Record
argument-hint: NUMBER=<4-digit> TITLE=<text> CONTEXT=<text> DECISION=<text> CONSEQUENCES=<text> [LINKS=<text>]
---

# adr-new

Create a new Architecture Decision Record.

## STEP 0: Activate Command

```bash
node -e "
const fs = require('fs');
const path = 'docs/09-agents/session-state.json';
if (fs.existsSync(path)) {
  const state = JSON.parse(fs.readFileSync(path, 'utf8'));
  const cmd = { name: 'adr', activated_at: new Date().toISOString(), state: {} };
  state.active_commands = state.active_commands || [];
  if (!state.active_commands.some(c => c.name === cmd.name)) state.active_commands.push(cmd);
  fs.writeFileSync(path, JSON.stringify(state, null, 2) + '\n');
  console.log('✅ adr command activated');
}
"
```

<!-- COMPACT_SUMMARY_START -->
## Compact Summary

**Command**: `adr`
**Purpose**: Create Architecture Decision Records (ADRs) documenting important architectural choices

**Quick Usage**:
```
/agileflow:adr NUMBER=0042 TITLE="Use PostgreSQL for persistence" CONTEXT="Need reliable ACID database" DECISION="PostgreSQL chosen over MongoDB" CONSEQUENCES="Better data integrity, steeper learning curve"
```

**What It Does**:
1. Parses input parameters (NUMBER, TITLE, CONTEXT, DECISION, CONSEQUENCES, optional LINKS)
2. Creates ADR file at `docs/03-decisions/adr-<NUMBER>-<slug>.md` using template
3. Shows preview and waits for YES/NO confirmation
4. Writes file if approved

**Template Structure** (@packages/cli/src/core/templates/adr-template.md):
- Frontmatter (number, title, date, status, tags)
- Context section (why decision needed)
- Decision section (what was chosen)
- Consequences section (trade-offs and impacts)
- Optional links to related docs

**Example ADR**:
```markdown
---
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
```

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

---
description: Create an Architecture Decision Record
allowed-tools: Bash, Read, Edit, Write, Glob, Grep
---

# adr-new

Create a new Architecture Decision Record.

## Prompt

ROLE: ADR Writer

INPUTS
NUMBER=<4-digit>  TITLE=<Decision Title>
CONTEXT=<short context>  DECISION=<choice>
CONSEQUENCES=<trade-offs>  LINKS=<optional bullets>

ACTION
Create docs/03-decisions/adr-<NUMBER>-<slug>.md from adr-template.md (date=now; status=Accepted unless specified).

Diff-first; YES/NO.

---
name: agileflow-adr
description: Detects architectural or technical decisions in conversations and formats them as Architecture Decision Records in docs/03-decisions/. Loads when discussing technology choices, architecture patterns, or trade-offs.
---

# AgileFlow ADR (Architecture Decision Records)

Automatically captures architectural and technical decisions and formats them as formal Architecture Decision Records (ADRs) in `docs/03-decisions/`.

## When to Use

This skill activates when:
- Discussing technology choices ("Should we use PostgreSQL or MongoDB?")
- Debating architecture patterns ("REST vs GraphQL")
- Making framework decisions ("React vs Vue")
- Discussing infrastructure choices ("AWS vs GCP")
- Evaluating trade-offs between options
- Keywords: "decision", "choose", "architecture", "trade-off"

## What This Does

1. Detects architectural decision discussions from conversations
2. Asks clarifying questions if needed (context, options, constraints)
3. Extracts decision elements (problem, options, drivers, trade-offs)
4. Generates properly formatted ADR file
5. Shows for approval before writing

## Instructions

1. **Detect decision discussion**: User is debating options or asking "which should we use?"

2. **Extract decision elements**:
   - Context/problem statement
   - Options being considered
   - Trade-offs for each option
   - Decision drivers (requirements, constraints)

3. **Read existing ADRs**:
   - Check `docs/03-decisions/` for numbering
   - Look for related decisions

4. **Generate ADR**:
   - File: `docs/03-decisions/ADR-###-descriptive-title.md`
   - Use MADR (Markdown Architecture Decision Records) format
   - Mark status as "Proposed" unless decision is final

5. **Confirm with user**: Show the ADR and ask for corrections

## ADR Format (MADR)

```markdown
# [ADR-###] Title

**Date**: YYYY-MM-DD
**Status**: Proposed | Accepted | Deprecated | Superseded
**Deciders**: Names of people involved
**Tags**: architecture, database, api, etc.

## Context and Problem Statement

[Describe the context and problem. What are we trying to solve? Why necessary?]

## Decision Drivers

- [Driver 1: e.g., Performance requirements]
- [Driver 2: e.g., Team expertise]
- [Driver 3: e.g., Cost constraints]

## Considered Options

- [Option 1]
- [Option 2]
- [Option 3]

## Decision Outcome

**Chosen option**: [Option X]

**Justification**: [Why chosen? What makes it best fit?]

### Positive Consequences

- [Good outcome 1]
- [Good outcome 2]

### Negative Consequences

- [Bad outcome 1]
- [Bad outcome 2 - with mitigation if possible]

## Pros and Cons of the Options

### [Option 1]

**Pros**:
- [Pro 1]
- [Pro 2]

**Cons**:
- [Con 1]
- [Con 2]

## Links

- [Related ADRs]
- [Relevant documentation]
- [External resources]

## Notes

- [Additional information]
- [Implementation notes]
```

## ADR Statuses

- **Proposed**: Under consideration, not yet decided
- **Accepted**: Decision made and approved
- **Deprecated**: No longer relevant (but kept for history)
- **Superseded**: Replaced by a newer decision (link to new ADR)

## Quality Checklist

Before creating ADR:
- [ ] Problem statement is clear and specific
- [ ] At least 2 options were considered
- [ ] Each option has pros and cons listed
- [ ] Decision drivers are explicitly stated
- [ ] Chosen option has clear justification
- [ ] Consequences (both positive and negative) documented
- [ ] File name follows pattern: ADR-###-descriptive-title.md
- [ ] Status is appropriate (Proposed/Accepted)

## Integration

- **agileflow-story-writer**: ADRs inform technical notes in stories
- **agileflow-tech-debt**: Negative consequences become tech debt items
- **agileflow-changelog**: Major decisions appear in changelog

## Notes

- Capture decisions even if they seem small - they provide context later
- Be honest about negative consequences - helps with future decisions
- Include who made the decision (deciders) - accountability matters
- Date decisions - context changes over time
- Keep ADRs focused - one decision per ADR
- ADRs are immutable once accepted - create new ADR if superseding
